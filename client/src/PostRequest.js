import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PostRequest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log(email, password); // do something with the values
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default PostRequest;