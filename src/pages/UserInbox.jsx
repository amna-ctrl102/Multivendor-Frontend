import Header from "../components/layout/Header";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { server } from "../server";
import { TfiGallery } from "react-icons/tfi";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { format } from "timeago.js";
import socketIO from "socket.io-client";

const ENDPOINT = "http://localhost:4000";

const socketId = socketIO(ENDPOINT, {
  transports: ["websocket"],
});

const UserInbox = () => {
  const { user } = useSelector((state) => state.user);

  const [conversations, setConversations] = useState([]);
  const [open, setOpen] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);

  // RECEIVE MESSAGE
  useEffect(() => {
    const handleMessage = (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images || [],
        conversationId: data.conversationId,
        createdAt: Date.now(),
      });
    };

    socketId.on("getMessage", handleMessage);

    return () => {
      socketId.off("getMessage", handleMessage);
    };
  }, []);

  // REFRESH MESSAGES ON ARRIVAL
  useEffect(() => {
    if (
      !arrivalMessage ||
      !currentChat?._id ||
      !currentChat.members.includes(arrivalMessage.sender) ||
      String(currentChat._id) !== String(arrivalMessage.conversationId)
    ) {
      return;
    }

    const refreshMessages = async () => {
      try {
        const res = await axios.get(
          `${server}/message/get-all-messages/${currentChat._id}`,
          {
            withCredentials: true,
          },
        );

        setMessages(res.data.messages || []);
      } catch (error) {
        console.log(error);
      }
    };

    refreshMessages();
  }, [arrivalMessage, currentChat]);

  // GET CONVERSATIONS
  useEffect(() => {
    if (!user?._id) return;

    const getConversation = async () => {
      try {
        const res = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user._id}`,
          {
            withCredentials: true,
          },
        );

        const uniqueConversations = Array.from(
          new Map(
            (res.data.conversations || []).map((conversation) => [
              [...(conversation.members || [])].sort().join("-"),
              conversation,
            ]),
          ).values(),
        );

        setConversations(uniqueConversations);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      }
    };

    getConversation();
  }, [user?._id]);

  // SOCKET USER REGISTRATION
  useEffect(() => {
    if (!user?._id) return;

    const registerUser = () => {
      socketId.emit("addUser", user._id);
    };

    const handleUsers = (data) => {
      setOnlineUsers(data);
    };

    socketId.on("connect", registerUser);
    socketId.on("getUsers", handleUsers);

    if (socketId.connected) {
      registerUser();
    }

    return () => {
      socketId.off("connect", registerUser);
      socketId.off("getUsers", handleUsers);
    };
  }, [user?._id]);

  // CHECK ONLINE USER
  const onlineCheck = (chat) => {
    const chatMember = chat.members.find(
      (member) => String(member) !== String(user?._id),
    );

    return onlineUsers.some(
      (onlineUser) => String(onlineUser.userId) === String(chatMember),
    );
  };

  // GET MESSAGES
  useEffect(() => {
    if (!currentChat?._id) return;

    const getMessage = async () => {
      try {
        const res = await axios.get(
          `${server}/message/get-all-messages/${currentChat._id}`,
          {
            withCredentials: true,
          },
        );

        setMessages(res.data.messages || []);
      } catch (error) {
        console.log(error);
      }
    };

    getMessage();
  }, [currentChat]);

  // SEND MESSAGE
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!currentChat || (!newMessage.trim() && selectedImages.length === 0)) {
      return;
    }

    const messageText = newMessage.trim();

    const formData = new FormData();

    formData.append("sender", user._id);
    formData.append("text", messageText);
    formData.append("conversationId", currentChat._id);

    selectedImages.forEach((image) => {
      formData.append("image", image);
    });

    const receiverId = currentChat.members.find(
      (member) => String(member) !== String(user._id),
    );

    try {
      const res = await axios.post(
        `${server}/message/create-new-message`,
        formData,
        {
          withCredentials: true,
        },
      );

      socketId.emit("sendMessages", {
        senderId: user._id,
        receiverId,
        text: messageText,
        images: res.data.message.images || [],
        conversationId: currentChat._id,
      });

      setMessages((previousMessages) => [
        ...previousMessages,
        res.data.message,
      ]);

      await updateLastMessage(messageText || "Image");

      setSelectedImages([]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  // UPDATE LAST MESSAGE
  const updateLastMessage = async (messageText) => {
    socketId.emit("updateLastMessage", {
      lastMessage: messageText,
      lastMessageId: user._id,
    });

    try {
      const res = await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: messageText,
          lastMessageId: user._id,
        },
        {
          withCredentials: true,
        },
      );

      setConversations((previousConversations) =>
        previousConversations.map((conversation) =>
          conversation._id === res.data.conversation._id
            ? res.data.conversation
            : conversation,
        ),
      );

      setCurrentChat(res.data.conversation);
      setNewMessage("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#faf7f9] overflow-x-hidden">
      {/* HEADER */}

      <div
        className={
          open ? "fixed top-0 left-0 w-full z-[100]" : "relative w-full z-20"
        }
      >
        <Header />
      </div>

      {/* CONVERSATION LIST */}

      {!open && (
        <>
          {/* PAGE HEADER */}

          <div className="w-full px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-7 md:py-8">
            <div className="max-w-[1200px] mx-auto mt-20 800px:mt-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-[4px] h-[32px] sm:h-[38px] md:h-[42px] bg-[#a30563] rounded-full flex-shrink-0" />

                <div className="min-w-0">
                  <h5 className="text-[21px] xs:text-[23px] sm:text-[26px] md:text-[28px] font-Poppins font-[600] text-[#111] leading-tight">
                    All Messages
                  </h5>

                  <p className="text-[12px] xs:text-[13px] sm:text-[14px] text-gray-500 mt-1">
                    Your conversations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONVERSATIONS */}

          <div className="w-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 pb-6 sm:pb-8">
            <div className="max-w-[1200px] mx-auto bg-white rounded-xl sm:rounded-2xl border border-[#ead7e2] shadow-[0_8px_30px_rgba(163,5,99,0.08)] overflow-hidden">
              {conversations?.length > 0 ? (
                <div className="w-full">
                  {conversations.map((item, index) => (
                    <MessageList
                      data={item}
                      key={item._id}
                      index={index}
                      setOpen={setOpen}
                      setCurrentChat={setCurrentChat}
                      me={user._id}
                      setUserData={setUserData}
                      online={onlineCheck(item)}
                      setActiveStatus={setActiveStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="px-5 py-16 text-center">
                  <p className="text-gray-400 text-sm">No conversations yet.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* OPEN CHAT */}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      )}
    </div>
  );
};

//    MESSAGE LIST
const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const [shop, setShop] = useState(null);

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    const userId = data.members.find((member) => String(member) !== String(me));

    const getShop = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`, {
          withCredentials: true,
        });

        setShop(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) {
      getShop();
    }
  }, [me, data]);

  return (
    <div
      className="
        w-full
        flex items-center
        px-3 xs:px-4 sm:px-5 md:px-6
        py-3.5 xs:py-4 sm:py-5
        border-b border-[#f0e3e9]
        cursor-pointer
        transition-all duration-200
        active:bg-[#a30563]/10
        hover:bg-[#a30563]/[0.035]
        last:border-b-0
      "
      onClick={() => {
        setCurrentChat(data);
        handleClick(data._id);
        setUserData(shop);
        setActiveStatus(online);
      }}
    >
      {/* AVATAR */}

      <div className="relative flex-shrink-0">
        <img
          src={shop?.avatar}
          alt=""
          className="
            w-[46px] h-[46px]
            xs:w-[50px] xs:h-[50px]
            sm:w-[56px] sm:h-[56px]
            md:w-[60px] md:h-[60px]
            rounded-full
            object-cover
            border-2 border-white
            shadow-[0_2px_8px_rgba(0,0,0,0.10)]
          "
        />

        <div
          className={`
            w-[11px] h-[11px]
            xs:w-[12px] xs:h-[12px]
            sm:w-[13px] sm:h-[13px]
            rounded-full
            absolute
            bottom-0
            right-0
            border-2 border-white
            ${online ? "bg-green-500" : "bg-gray-300"}
          `}
        />
      </div>

      {/* CONVERSATION INFO */}

      <div className="pl-3 xs:pl-3.5 sm:pl-4 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-[14px] xs:text-[15px] sm:text-[17px] md:text-[18px] font-[600] text-[#111] truncate">
            {shop?.name || "Loading..."}
          </h1>

          {online && (
            <span className="hidden sm:block text-[10px] md:text-[11px] text-green-600 font-medium flex-shrink-0">
              Online
            </span>
          )}
        </div>

        <p className="text-[12px] xs:text-[13px] sm:text-[14px] md:text-[15px] text-gray-500 truncate mt-1">
          {data?.lastMessageId !== shop?._id
            ? "You:"
            : `${shop?.name?.split(" ")[0] || "User"}:`}{" "}
          {data?.lastMessage || "No messages yet"}
        </p>
      </div>

      {/* ARROW */}

      <div className="ml-2 sm:ml-4 flex-shrink-0">
        <AiOutlineArrowRight
          size={17}
          className="sm:w-[19px] sm:h-[19px] text-gray-400"
        />
      </div>
    </div>
  );
};

//    SELLER INBOX / CHAT
const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  selectedImages,
  setSelectedImages,
}) => {
  const messagesContainerRef = useRef(null);

  // AUTO SCROLL TO BOTTOM
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages]);

  // CLOSE CHAT
  const closeChat = () => {
    setOpen(false);
  };

  return (
    <div
      className="
        fixed
        inset-0
        top-[60px]
        sm:top-[64px]
        md:top-[70px]
        800px:top-[70px]
        lg:top-[160px]

        w-full

        bg-[#faf7f9]

        flex
        flex-col

        overflow-hidden

        z-[80]
      "
    >
      {/* CHAT HEADER */}

      <div
        className="
          w-full
          flex-shrink-0

          bg-white

          border-b
          border-[#ead7e2]

          shadow-sm

          px-3
          sm:px-6
          md:px-8
          lg:px-10

          py-3
          sm:py-4
        "
      >
        <div
          className="
            w-full
            max-w-[1200px]
            mx-auto

            flex
            items-center
            justify-between

            gap-3
          "
        >
          {/* USER INFO */}

          <div className="flex items-center min-w-0 flex-1">
            {/* AVATAR */}

            <div className="relative flex-shrink-0">
              <img
                src={userData?.avatar}
                alt=""
                className="
                  w-[42px]
                  h-[42px]

                  sm:w-[52px]
                  sm:h-[52px]

                  md:w-[58px]
                  md:h-[58px]

                  rounded-full

                  object-cover

                  border-2
                  border-[#a30563]/20
                "
              />

              {activeStatus && (
                <div
                  className="
                    w-[10px]
                    h-[10px]

                    sm:w-[12px]
                    sm:h-[12px]

                    bg-green-500

                    rounded-full

                    absolute

                    bottom-0
                    right-0

                    border-2
                    border-white
                  "
                />
              )}
            </div>

            {/* USER NAME */}

            <div
              className="
                ml-3
                sm:ml-4

                min-w-0
              "
            >
              <h1
                className="
                  text-[15px]

                  sm:text-[17px]

                  md:text-[19px]

                  font-[600]

                  text-[#111]

                  truncate
                "
              >
                {userData?.name || "Loading..."}
              </h1>

              <p
                className="
                  text-[11px]
                  sm:text-[13px]

                  text-gray-500

                  mt-0.5
                "
              >
                {activeStatus ? (
                  <span className="text-green-600 font-medium">Active Now</span>
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={closeChat}
            className="
              w-[36px]
              h-[36px]

              sm:w-[40px]
              sm:h-[40px]

              md:w-[42px]
              md:h-[42px]

              rounded-full

              flex
              items-center
              justify-center

              bg-[#a30563]/10

              text-[#a30563]

              hover:bg-[#a30563]
              hover:text-white

              active:scale-95

              transition-all
              duration-200

              flex-shrink-0
            "
          >
            <AiOutlineArrowRight size={19} className="rotate-180" />
          </button>
        </div>
      </div>

      {/* MESSAGES */}

      <div
        ref={messagesContainerRef}
        className="
          w-full

          flex-1
          min-h-0

          px-2
          sm:px-5
          md:px-8
          lg:px-10

          py-3
          sm:py-5

          overflow-y-auto
          overflow-x-hidden

          overscroll-contain

          hide-scrollbar
        "
      >
        <div className="w-full max-w-[1000px] mx-auto">
          {messages && messages.length > 0 ? (
            messages.map((item, index) => {
              const isMine = String(item.sender) === String(sellerId);

              return (
                <div
                  key={item._id || index}
                  className={`
                    flex
                    w-full

                    my-2
                    sm:my-3

                    ${isMine ? "justify-end" : "justify-start"}
                  `}
                >
                  {/* RECEIVER AVATAR */}

                  {!isMine && (
                    <img
                      src={userData?.avatar}
                      className="
                        w-[28px]
                        h-[28px]

                        sm:w-[38px]
                        sm:h-[38px]

                        rounded-full

                        mr-2
                        sm:mr-3

                        object-cover

                        flex-shrink-0

                        mt-auto
                      "
                      alt=""
                    />
                  )}

                  {/* MESSAGE */}

                  <div
                    className={`
                      flex
                      flex-col

                      ${isMine ? "items-end" : "items-start"}

                      max-w-[82%]
                      sm:max-w-[70%]
                      md:max-w-[65%]
                    `}
                  >
                    {/* BUBBLE */}

                    <div
                      className={`
                        px-3
                        sm:px-4

                        py-2
                        sm:py-3

                        rounded-2xl

                        text-white

                        text-[13px]
                        sm:text-[15px]

                        leading-5
                        sm:leading-6

                        shadow-sm

                        break-words

                        whitespace-pre-wrap

                        overflow-hidden

                        ${
                          isMine
                            ? "bg-[#111] rounded-br-md"
                            : "bg-[#a30563] rounded-bl-md"
                        }
                      `}
                    >
                      {item.text && <p>{item.text}</p>}

                      {/* IMAGES */}

                      {item.images?.map((image) => (
                        <img
                          key={image}
                          src={image}
                          alt="Message attachment"
                          className="
                            mt-2

                            max-w-full

                            max-h-[180px]
                            sm:max-h-[240px]
                            md:max-h-[280px]

                            rounded-lg

                            object-cover
                          "
                        />
                      ))}
                    </div>

                    {/* TIME */}

                    <p
                      className={`
                        text-[9px]
                        sm:text-[11px]

                        text-gray-400

                        pt-1
                        px-1

                        ${isMine ? "text-right" : "text-left"}
                      `}
                    >
                      {format(item.createdAt || item.createAt)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            /* EMPTY CHAT */

            <div
              className="
                min-h-[300px]
                h-full

                flex
                items-center
                justify-center

                px-4
              "
            >
              <div className="text-center">
                <div
                  className="
                    w-[52px]
                    h-[52px]

                    sm:w-[60px]
                    sm:h-[60px]

                    mx-auto
                    mb-3

                    rounded-full

                    bg-[#a30563]/10

                    flex
                    items-center
                    justify-center
                  "
                >
                  <TfiGallery size={21} className="text-[#a30563]" />
                </div>

                <h3
                  className="
                    text-[15px]
                    sm:text-[16px]

                    font-[600]

                    text-[#111]
                  "
                >
                  Start a Conversation
                </h3>

                <p
                  className="
                    text-[12px]
                    sm:text-[13px]

                    text-gray-500

                    mt-1
                  "
                >
                  Send a message to shop owner.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MESSAGE INPUT */}

      <div
        className="
          w-full

          flex-shrink-0

          bg-white

          border-t
          border-[#ead7e2]

          px-2
          sm:px-5
          md:px-8
          lg:px-10

          py-2.5
          sm:py-4

          pb-[max(0.625rem,env(safe-area-inset-bottom))]
        "
      >
        <form
          className="
            w-full
            max-w-[1000px]
            mx-auto

            flex
            items-center

            gap-2
            sm:gap-3
          "
          onSubmit={sendMessageHandler}
        >
          {/* GALLERY */}

          <button
            type="button"
            onClick={() =>
              document.getElementById("user-message-images")?.click()
            }
            className="
              w-[40px]
              h-[40px]

              sm:w-[46px]
              sm:h-[46px]

              rounded-full

              bg-[#a30563]/10

              flex
              items-center
              justify-center

              flex-shrink-0

              hover:bg-[#a30563]

              group

              active:scale-95

              transition-all
              duration-200
            "
          >
            <TfiGallery
              size={17}
              className="
                text-[#a30563]
                group-hover:text-white
              "
            />
          </button>

          <input
            id="user-message-images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) =>
              setSelectedImages(Array.from(event.target.files || []))
            }
          />

          {/* SELECTED IMAGES */}

          {selectedImages.length > 0 && (
            <div
              className="
                hidden
                sm:flex

                items-center

                gap-1

                max-w-[180px]

                text-xs
                text-gray-500

                truncate
              "
            >
              <TfiGallery
                size={14}
                className="
                  text-[#a30563]
                  flex-shrink-0
                "
              />

              <span className="truncate">{selectedImages.length} selected</span>
            </div>
          )}

          {/* INPUT */}

          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              placeholder="Enter your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="
                w-full

                h-[42px]
                sm:h-[48px]

                rounded-full

                border
                border-[#e5d5de]

                bg-[#faf7f9]

                px-3
                sm:px-5

                pr-[50px]

                text-[13px]
                sm:text-[15px]

                text-[#111]

                outline-none

                focus:border-[#a30563]

                focus:ring-2
                focus:ring-[#a30563]/10

                placeholder:text-gray-400

                min-w-0
              "
            />

            <input type="submit" value="Send" className="hidden" id="send" />

            <label
              htmlFor="send"
              className="
                absolute
                right-1
                top-1/2
                -translate-y-1/2

                cursor-pointer
              "
            >
              <div
                className="
                  w-[34px]
                  h-[34px]

                  sm:w-[40px]
                  sm:h-[40px]

                  rounded-full

                  bg-[#a30563]

                  hover:bg-[#85044f]

                  flex
                  items-center
                  justify-center

                  active:scale-95

                  transition-all
                "
              >
                <AiOutlineSend size={17} className="text-white" />
              </div>
            </label>
          </div>
        </form>

        {/* MOBILE IMAGE INDICATOR */}

        {selectedImages.length > 0 && (
          <div
            className="
              sm:hidden

              flex
              items-center
              gap-1.5

              mt-1.5
              px-1

              text-[10px]
              text-gray-500
            "
          >
            <TfiGallery size={12} className="text-[#a30563]" />

            <span>
              {selectedImages.length} image
              {selectedImages.length > 1 ? "s" : ""} selected
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInbox;
