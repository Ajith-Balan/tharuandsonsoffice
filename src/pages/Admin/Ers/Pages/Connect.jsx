import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { useAuth } from "../../context/Auth";
import axios from "axios";

const Connect = () => {
  const [auth] = useAuth();
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Fetch chats
  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/chat/getchats`
      );

      let allChats = res.data.chats || res.data.chat || [];
      allChats = allChats.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setChats(allChats);
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Add new chat
  const addChat = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/chat/createchat`,
        {
          text,
          user: auth?.user?.name || "Unknown",
        }
      );

      const newChat = res.data.chat || res.data;
      setChats((prev) => [...prev, newChat]);
      setText("");

      // ✅ Scroll to bottom only when a new message is added
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error creating chat:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Chat - Manager">
      <div className="flex flex-col md:flex-row gap-4 p-4 ">
        {/* Left Menu */}
        <div className="w-full md:w-1/4">
          <AdminMenu />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col  bg-gray-100 rounded-lg shadow p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto  space-y-3 p-2">
            {loading && chats.length === 0 ? (
              <p className="text-gray-500">Loading chats...</p>
            ) : chats.length === 0 ? (
              <p className="text-gray-500">No chats yet.</p>
            ) : (
              chats.map((chat) => {
                const isMe = chat?.user === auth?.user?.name;
                return (
                  <div
                    key={chat._id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} `}
                  >
                    <div
                      className={`relative max-w-xs md:max-w-sm p-3 rounded-2xl ${
                        isMe
                          ? "bg-green-200 text-gray-900 self-end"
                          : "bg-gray-300 text-gray-900 self-start"
                      }`}
                    >
                      {!isMe && (
                        <p className="text-xs font-semibold underline text-gray-700 mb-1">
                          {chat?.user || "Unknown"}
                        </p>
                      )}
                      <p >{chat.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addChat();
            }}
            className="mt-4 sticky bottom-0 flex gap-2"
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-lg  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Connect;
