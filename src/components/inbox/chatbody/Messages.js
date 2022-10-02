
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { messagesApi } from "../../../features/messages/messagesApi";
import { scrollingF } from "../../../features/messages/messagesSlice";
import Message from "./Message";


export default function Messages({ messages,totalCount }) {
    const [page, setPage] = useState(1);
    const [hasMoree, setHasMoree] = useState(true);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth) || {};
    const { email } = user || {};

    const reff = useRef(null)
    const {isScroll} = useSelector(state => state.messages)
    const {id} = useParams()
    totalCount = Number(totalCount)

    const fetchMoreMessage = () => {
        setPage((prevPage) => prevPage + 1);
        
    };


    useEffect(() => {
 
        // if(isScroll){
            
        //     reff.current.el.scrollTo({
        //         top: 100,
        //         behavior: 'smooth'
        //       })
        //     }
            // reff.current.scrollTo({
            //     top:100
            // })
        // console.log(reff.current);
        // console.log(reff.current.scrollTop);
        // console.log(reff.current.scrollHeight);
        // reff.current.scrollTop = reff.current.scrollHeight
        if(isScroll){
            // reff.current.scrollIntoView()
                 reff.current.el.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }
            dispatch(scrollingF())
        

        // if(reff.current){    
        //     reff.current.scrollIntoView()

        // }
            // reff.current.scrollTop = reff.current.offsetHeight
    },[isScroll,dispatch])

    useEffect(() => {
        if (page > 1) {
          console.log('fetch call');
            dispatch(
                messagesApi.endpoints.getMoreMessages.initiate({
                    id,
                    page,
                })
            );
        }


    }, [page,dispatch,id]);
  

    useEffect(() => {
        if (totalCount > 0) {
            const more =
                Math.ceil(
                    totalCount /
                        Number(process.env.REACT_APP_MESSAGES_PER_PAGE)
                ) > page;

            setHasMoree(more);
        }
    }, [totalCount, page]);



    return (
        <div className="relative w-full h-[calc(100vh_-_197px)] p-6  flex flex-col-reverse">
            <ul className="space-y-2">

   
  {/* Put the scroll bar always on the bottom */}
  <div
  id="scrollableDiv"
  style={{
    height: 533,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',

  }}
>
  <InfiniteScroll
    
    dataLength={messages.length}
    ref={reff}
    style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
    inverse={true} //
    next={fetchMoreMessage}
    hasMore={hasMoree}
    loader={<h4>Loading...</h4>}
    height={533}
 scrollableTarget="scrollableDiv"
  >
        
        {messages
                    .slice()
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((message) => {
                        const {
                            message: lastMessage,
                            id,
                            sender,
                        } = message || {};
                      

                        const justify =
                            sender.email !== email ? "start" : "end";

                        return (
                            <div key={id} >

                           
                            <Message
                        
                                justify={justify}
                                message={lastMessage}
                            />
                             </div>
                        );
                    })}
  </InfiniteScroll>
  </div>



            </ul>
        </div>
    );
}
