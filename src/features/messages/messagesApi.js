
import io from "socket.io-client";
import { apiSlice } from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (id) =>
                `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
                transformResponse(apiResponse, meta) {
                    const totalCount = meta.response.headers.get("X-Total-Count");
                    return {
                        data: apiResponse,
                        totalCount
                    };
                },

                async onCacheEntryAdded(
                    arg,
                    { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
                ) {
                    // create socket
                    const socket = io("https://lws-chat-app-rtk.herokuapp.com/", {
                        reconnectionDelay: 1000,
                        reconnection: true,
                        reconnectionAttemps: 10,
                        transports: ["websocket"],
                        agent: false,
                        upgrade: false,
                        rejectUnauthorized: false,
                    });
    
                    try {
                        await cacheDataLoaded;
                        socket.on("message",(data) => {
                         
                        updateCachedData((draft) => {
                               // eslint-disable-next-line eqeqeq
                               if(data.data.conversationId.toString() == arg.toString()){
                           
                                draft.data.push(data.data)
                               }

                        });
         
                            
                        });
                    } catch (err) {}
    
                    await cacheEntryRemoved;
                    socket.close();
                },
        }),
        getMoreMessages: builder.query({
            query: ({id,page}) =>
            `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=${page}&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
            async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
                try {
                    const messages = await queryFulfilled;
          
                    if (messages?.data?.length > 0) {

                    
                        // update conversation cache pessimistically start
                         await dispatch(
                            apiSlice.util.updateQueryData(
                                "getMessages",
                                id.toString(),
                                (draft) => {
                                 
                                    return {
                                        data: [
                                            ...draft.data,
                                            ...messages.data,
                                        ],
                                        totalCount: Number(draft.totalCount),
                                    };
                                }
                            )
                        );
                        // update messages cache pessimistically end
                    }
                } catch (err) {
                    console.log(err);
                }
            },
        }),
        addMessage: builder.mutation({
            query: (data) => ({
                url: "/messages",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
