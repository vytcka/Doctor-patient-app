export const users = {
  u1: { id: "u1", name: "Patient" },
  u2: { id: "u2", name: "Doctor" }
};

export const initialMessages = [
  { id: "m1", text: "Hello doctor", senderId: "u1", timestamp: Date.now() - 5000 },
  { id: "m2", text: "Good afternoon patient.", senderId: "u2", timestamp: Date.now() - 3000 }
];
