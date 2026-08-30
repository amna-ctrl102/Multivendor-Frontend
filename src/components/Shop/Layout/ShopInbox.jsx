import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { TfiGallery } from "react-icons/tfi";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { format } from "timeago.js";
import socketIO from "socket.io-client";

const ENDPOINT = "http://localhost:4000";

const socketId = socketIO(ENDPOINT, {
  transports: ["websocket"],
});

const ShopInbox = () => {
  const { seller } = useSelector((state) => state.seller);

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

  // REFRESH MESSAGES WHEN NEW MESSAGE ARRIVES
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
    if (!seller?._id) return;

    const getConversation = async () => {
      try {
        const res = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller._id}`,
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
  }, [seller?._id]);

  // REGISTER SELLER WITH SOCKET
  useEffect(() => {
    if (!seller?._id) return;

    const registerSeller = () => {
      socketId.emit("addUser", seller._id);
    };

    const handleUsers = (data) => {
      setOnlineUsers(data);
    };

    socketId.on("connect", registerSeller);
    socketId.on("getUsers", handleUsers);

    if (socketId.connected) {
      registerSeller();
    }

    return () => {
      socketId.off("connect", registerSeller);
      socketId.off("getUsers", handleUsers);
    };
  }, [seller?._id]);

  // CHECK ACTIVE USER
  useEffect(() => {
    if (!currentChat || !seller?._id) return;

    const otherMember = currentChat.members.find(
      (member) => String(member) !== String(seller._id),
    );

    setActiveStatus(
      onlineUsers.some(
        (onlineUser) => String(onlineUser.userId) === String(otherMember),
      ),
    );
  }, [currentChat, onlineUsers, seller?._id]);

  // CHECK ONLINE USER
  const onlineCheck = (chat) => {
    const chatMember = chat.members.find(
      (member) => String(member) !== String(seller?._id),
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

    try {
      const formData = new FormData();

      formData.append("sender", seller._id);
      formData.append("text", messageText);
      formData.append("conversationId", currentChat._id);

      selectedImages.forEach((image) => {
        formData.append("image", image);
      });

      const res = await axios.post(
        `${server}/message/create-new-message`,
        formData,
        {
          withCredentials: true,
        },
      );

      const receiverId = currentChat.members.find(
        (member) => String(member) !== String(seller._id),
      );

      socketId.emit("sendMessages", {
        senderId: seller._id,
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
      lastMessageId: seller._id,
    });

    try {
      const res = await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: messageText,
          lastMessageId: seller._id,
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
    <div
      className="
        w-full
        h-[calc(100dvh-72px)]
        min-h-0
        p-2
        sm:p-4
        md:p-5
        lg:p-8
        overflow-hidden
        bg-[#f5f7f8]
      "
    >
      <div
        className="
          w-full
          max-w-[900px]
          h-full
          min-h-0
          mx-auto
        "
      >
        <div
          className="
            w-full
            h-full
            min-h-0
            bg-white
            rounded-xl
            sm:rounded-2xl
            border border-[#e5e7eb]
            shadow-[0_8px_30px_rgba(0,0,0,0.06)]
            overflow-hidden
            flex flex-col
          "
        >
          {/* CONVERSATION LIST */}

          {!open && (
            <>
              <div
                className="
                  shrink-0
                  px-4
                  sm:px-6
                  md:px-8
                  py-4
                  sm:py-5
                  border-b border-[#e5e7eb]
                  bg-white
                "
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="
                      w-[4px]
                      h-[28px]
                      sm:h-[34px]
                      rounded-full
                      bg-[#077f9c]
                      flex-shrink-0
                    "
                  />

                  <div className="min-w-0">
                    <h5
                      className="
                        text-[20px]
                        sm:text-[24px]
                        md:text-[28px]
                        font-Poppins
                        font-[600]
                        text-[#111]
                        truncate
                      "
                    >
                      All Messages
                    </h5>

                    <p
                      className="
                        text-[11px]
                        sm:text-[13px]
                        text-gray-500
                        mt-0.5
                      "
                    >
                      Manage your customer conversations
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  hide-scrollbar
                  px-2
                  sm:px-4
                  md:px-5
                  py-3
                  sm:py-4
                "
              >
                {conversations && conversations.length > 0 ? (
                  conversations.map((item, index) => (
                    <MessageList
                      data={item}
                      key={item._id}
                      index={index}
                      setOpen={setOpen}
                      setCurrentChat={setCurrentChat}
                      me={seller._id}
                      setUserData={setUserData}
                      online={onlineCheck(item)}
                      setActiveStatus={setActiveStatus}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[250px]">
                    <p className="text-gray-400 text-sm">
                      No conversations yet.
                    </p>
                  </div>
                )}
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
              sellerId={seller._id}
              userData={userData}
              activeStatus={activeStatus}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MESSAGE LIST
========================================================= */

const MessageList = ({
  data,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };

  // GET CUSTOMER INFORMATION
  useEffect(() => {
    const userId = data.members.find(
      (member) => String(member) !== String(me),
    );

    if (!userId) return;

    const getUser = async () => {
      try {
        const res = await axios.get(
          `${server}/user/user-info/${userId}`,
          {
            withCredentials: true,
          },
        );

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [me, data]);

  return (
    <div
      className="
        w-full
        flex
        items-center
        gap-2
        sm:gap-3
        p-2.5
        sm:p-3
        md:p-4
        mb-1.5
        sm:mb-2
        rounded-lg
        sm:rounded-xl
        border border-transparent
        cursor-pointer
        transition-all duration-200
        hover:bg-[#077f9c]/[0.05]
        hover:border-[#077f9c]/20
        active:bg-[#077f9c]/10
      "
      onClick={() => {
        setCurrentChat(data);
        handleClick(data._id);
        setUserData(user);
        setActiveStatus(online);
      }}
    >
      {/* AVATAR */}

      <div className="relative flex-shrink-0">
        <img
          src={user?.avatar}
          alt=""
          className="
            w-[44px]
            h-[44px]
            sm:w-[50px]
            sm:h-[50px]
            md:w-[56px]
            md:h-[56px]
            rounded-full
            object-cover
            border-2 border-white
            shadow-[0_2px_8px_rgba(0,0,0,0.12)]
          "
        />

        <div
          className={`
            w-[11px]
            h-[11px]
            sm:w-[13px]
            sm:h-[13px]
            rounded-full
            absolute
            bottom-0
            right-0
            border-2
            border-white
            ${online ? "bg-[#077f9c]" : "bg-gray-300"}
          `}
        />
      </div>

      {/* USER INFO */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h1
            className="
              text-[14px]
              sm:text-[16px]
              md:text-[18px]
              font-[600]
              text-[#111]
              truncate
            "
          >
            {user?.name || "Loading..."}
          </h1>

          {online && (
            <span
              className="
                hidden
                sm:block
                flex-shrink-0
                text-[10px]
                md:text-[11px]
                font-[500]
                text-[#077f9c]
              "
            >
              Online
            </span>
          )}
        </div>

        <p
          className="
            text-[12px]
            sm:text-[13px]
            md:text-[14px]
            text-gray-500
            truncate
            mt-0.5
          "
        >
          {data?.lastMessageId !== user?._id
            ? "You:"
            : `${user?.name?.split(" ")[0] || "User"}:`}{" "}
          {data?.lastMessage || "No messages yet"}
        </p>
      </div>

      {/* ARROW */}

      <div className="ml-1 sm:ml-2 flex-shrink-0">
        <AiOutlineArrowRight
          size={16}
          className="sm:w-[18px] sm:h-[18px] text-gray-400"
        />
      </div>
    </div>
  );
};

/* =========================================================
   SELLER INBOX
========================================================= */

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
  const location = useLocation();
  const navigate = useNavigate();

  const messagesContainerRef = useRef(null);

  // CLOSE INBOX
  const closeInbox = () => {
    setOpen(false);

    navigate(location.pathname, {
      replace: true,
    });
  };

  // AUTO SCROLL
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages]);

  return (
    <div
      className="
        w-full
        h-full
        min-h-0
        flex
        flex-col
        bg-[#f7f9fa]
        overflow-hidden
      "
    >
      {/* CHAT HEADER */}

      <div
        className="
          w-full
          flex-shrink-0
          px-3
          sm:px-5
          md:px-6
          py-2.5
          sm:py-3
          md:py-4
          bg-white
          border-b border-[#e5e7eb]
          shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        "
      >
        <div className="flex items-center justify-between gap-2">
          {/* USER */}

          <div className="flex items-center min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={userData?.avatar}
                alt=""
                className="
                  w-[40px]
                  h-[40px]
                  sm:w-[48px]
                  sm:h-[48px]
                  md:w-[54px]
                  md:h-[54px]
                  rounded-full
                  object-cover
                  border-2 border-[#077f9c]/20
                "
              />

              {activeStatus && (
                <div
                  className="
                    w-[10px]
                    h-[10px]
                    sm:w-[12px]
                    sm:h-[12px]
                    rounded-full
                    bg-[#077f9c]
                    absolute
                    bottom-0
                    right-0
                    border-2
                    border-white
                  "
                />
              )}
            </div>

            <div className="pl-2 sm:pl-3 md:pl-4 min-w-0">
              <h1
                className="
                  text-[14px]
                  sm:text-[16px]
                  md:text-[18px]
                  font-[600]
                  text-[#111]
                  truncate
                  max-w-[160px]
                  sm:max-w-[300px]
                  md:max-w-none
                "
              >
                {userData?.name || "Customer"}
              </h1>

              <p
                className="
                  text-[10px]
                  sm:text-[12px]
                  md:text-[13px]
                  mt-0.5
                "
              >
                {activeStatus ? (
                  <span className="text-[#077f9c] font-[500]">
                    Active Now
                  </span>
                ) : (
                  <span className="text-gray-400">Offline</span>
                )}
              </p>
            </div>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={closeInbox}
            className="
              w-[34px]
              h-[34px]
              sm:w-[38px]
              sm:h-[38px]
              md:w-[42px]
              md:h-[42px]
              rounded-full
              flex
              items-center
              justify-center
              bg-[#077f9c]/10
              text-[#077f9c]
              hover:bg-[#077f9c]
              hover:text-white
              transition-all duration-200
              flex-shrink-0
            "
          >
            <AiOutlineArrowRight
              size={18}
              className="rotate-180 sm:w-[20px] sm:h-[20px]"
            />
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
          overflow-y-auto
          px-2
          sm:px-4
          md:px-5
          lg:px-8
          py-3
          sm:py-4
          md:py-5
          hide-scrollbar
        "
      >
        <div className="max-w-[900px] mx-auto">
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
                        sm:w-[34px]
                        sm:h-[34px]
                        md:w-[38px]
                        md:h-[38px]
                        rounded-full
                        mr-1.5
                        sm:mr-2
                        md:mr-3
                        object-cover
                        flex-shrink-0
                      "
                      alt=""
                    />
                  )}

                  <div
                    className="
                      max-w-[82%]
                      sm:max-w-[72%]
                      md:max-w-[65%]
                      min-w-0
                    "
                  >
                    {/* MESSAGE BUBBLE */}

                    <div
                      className={`
                        px-3
                        sm:px-4
                        py-2
                        sm:py-2.5
                        md:py-3
                        rounded-2xl
                        text-white
                        text-[13px]
                        sm:text-[14px]
                        md:text-[15px]
                        leading-5
                        sm:leading-6
                        shadow-sm
                        break-words
                        overflow-hidden
                        ${
                          isMine
                            ? "bg-[#111] rounded-br-md"
                            : "bg-[#077f9c] rounded-bl-md"
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
                            max-h-[180px]
                            sm:max-h-[220px]
                            max-w-full
                            sm:max-w-[260px]
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
                        sm:text-[10px]
                        md:text-[11px]
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
            <div
              className="
                min-h-[250px]
                sm:min-h-[300px]
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
                    bg-[#077f9c]/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <TfiGallery
                    size={21}
                    className="text-[#077f9c]"
                  />
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
                  Send a message to your customer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEND MESSAGE */}

      <div
        className="
          w-full
          flex-shrink-0
          bg-white
          border-t border-[#e5e7eb]
          px-2
          sm:px-4
          md:px-5
          lg:px-8
          py-2.5
          sm:py-3
          md:py-4
        "
      >
        {/* SELECTED IMAGES */}

        {selectedImages.length > 0 && (
          <div
            className="
              max-w-[900px]
              mx-auto
              flex
              items-center
              gap-1.5
              mb-2
              px-1
              text-[10px]
              sm:text-xs
              text-[#077f9c]
            "
          >
            <TfiGallery size={14} />

            <span className="truncate">
              {selectedImages.length}{" "}
              {selectedImages.length === 1 ? "image" : "images"} selected
            </span>
          </div>
        )}

        <form
          className="
            max-w-[900px]
            mx-auto
            flex
            items-center
            gap-1.5
            sm:gap-2
            md:gap-3
          "
          onSubmit={sendMessageHandler}
        >
          {/* GALLERY */}

          <button
            type="button"
            onClick={() =>
              document.getElementById("shop-message-images")?.click()
            }
            className="
              w-[38px]
              h-[38px]
              sm:w-[42px]
              sm:h-[42px]
              md:w-[46px]
              md:h-[46px]
              rounded-full
              bg-[#077f9c]/10
              flex
              items-center
              justify-center
              flex-shrink-0
              hover:bg-[#077f9c]
              group
              transition-all duration-200
            "
          >
            <TfiGallery
              size={17}
              className="
                text-[#077f9c]
                group-hover:text-white
                transition
              "
            />
          </button>

          <input
            id="shop-message-images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) =>
              setSelectedImages(
                Array.from(event.target.files || []),
              )
            }
          />

          {/* INPUT */}

          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              required={selectedImages.length === 0}
              placeholder="Enter your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="
                w-full
                h-[40px]
                sm:h-[44px]
                md:h-[48px]
                rounded-full
                border
                border-[#dfe5e8]
                bg-[#f7f9fa]
                px-3
                sm:px-4
                md:px-5
                pr-12
                text-[12px]
                sm:text-[14px]
                md:text-[15px]
                text-[#111]
                outline-none
                transition-all duration-200
                focus:border-[#077f9c]
                focus:ring-2
                focus:ring-[#077f9c]/10
                placeholder:text-gray-400
              "
            />

            <input
              type="submit"
              value="Send"
              className="hidden"
              id="send"
            />

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
                  sm:w-[38px]
                  sm:h-[38px]
                  rounded-full
                  bg-[#077f9c]
                  hover:bg-[#056b84]
                  flex
                  items-center
                  justify-center
                  transition-all duration-200
                  shadow-sm
                "
              >
                <AiOutlineSend
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-white"
                />
              </div>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopInbox;

