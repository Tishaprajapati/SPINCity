import React, { useState } from "react";
import "../../style/user/recoverpassword.css";

function RecoverPassword() {
const [formData, setFormData] = useState({
email: "",
favFood: "",
favSport: "",
});

const handleChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({
...prev,
[name]: value,
}));
};

const handleSubmit = async (e) => {
e.preventDefault();


try {
  const response = await fetch(
    "https://spincity.onrender.com/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  if (response.ok) {
    alert("Your password has been sent to your email!");
  } else {
    alert("Failed to recover password");
  }
} catch (err) {
  console.error(err);
  alert("Server error");
}


};

return ( <div className="recover-wrapper"> <div className="recover-card"> <div className="recover-header"> <div className="shield-icon">🔐</div> <h3>Recover Password</h3> <p>Answer your security questions</p> </div>


    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Registered Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="favFood"
        placeholder="Favorite Food"
        value={formData.favFood}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="favSport"
        placeholder="Favorite Sport"
        value={formData.favSport}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Send Password
      </button>
    </form>

    <div className="back-link">
      <a href="/login">Back to Login</a>
    </div>
  </div>
</div>


);
}

export default RecoverPassword;
