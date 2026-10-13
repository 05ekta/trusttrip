import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { moderateMessage } from "../utils/moderation";

export default function ChatWindow() {
  const { uid } = useParams(); // user you're chatting with
  const me = auth.currentUser;

  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [warning, setWarning] = useState(null);

  const bottomRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------------------------------------------------------
  // LOAD OTHER USER'S DATA
  // ----------------------------------------------------------------
  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setOtherUser(snap.data());
    })();
  }, [uid]);

  // ----------------------------------------------------------------
  // UNIQUE CHAT ID FOR BOTH USERS
  // ----------------------------------------------------------------
  const chatId = me.uid < uid ? `${me.uid}_${uid}` : `${uid}_${me.uid}`;

  // ----------------------------------------------------------------
  // REALTIME FIRESTORE MESSAGE LISTENER
  // ----------------------------------------------------------------
  useEffect(() => {
    const msgRef = collection(db, "chats", chatId, "messages");
    const q = query(msgRef, orderBy("timestamp", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(list);
    });

    return () => unsub();
  }, [chatId]);

  // ----------------------------------------------------------------
  // SEND MESSAGE WITH AI MODERATION
  // ----------------------------------------------------------------
  const sendMessage = async () => {
    if (!inputMsg.trim()) return;

    // 🔥 Run message through moderation API
    const mod = await moderateMessage(inputMsg);

    if (!mod.allowed) {
      setWarning("⚠ Message blocked: inappropriate content detected.");
      setTimeout(() => setWarning(null), 3000);
      return;
    }

    // send message to Firebase
    await addDoc(collection(db, "chats", chatId, "messages"), {
      from: me.uid,
      to: uid,
      text: inputMsg,
      timestamp: serverTimestamp(),
    });

    setInputMsg("");
  };

  if (!otherUser)
    return <div className="p-8 text-center">Loading chat…</div>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* HEADER */}
      <div className="p-4 bg-white shadow flex items-center gap-3 border-b">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
          {otherUser.name?.[0] || "U"}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{otherUser.name}</h2>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] p-3 rounded-lg mb-3 shadow 
              ${msg.from === me.uid
                ? "bg-blue-600 text-white ml-auto"
                : "bg-white text-gray-900"
              }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs opacity-60 mt-1">
              {msg.timestamp?.toDate
                ? msg.timestamp.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* WARNING BADGE */}
      {warning && (
        <div className="text-center py-2 bg-red-100 text-red-700 font-medium">
          {warning}
        </div>
      )}

      {/* INPUT BOX */}
      <div className="p-4 bg-white flex gap-2 border-t">
        <input
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message…"
          className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={sendMessage}
          className="px-5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
