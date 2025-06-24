import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

// ✅ MUI components
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
import Avatar from "@mui/material/Avatar";


const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState(undefined);

const handleCoverImageChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    setCoverImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
};

 const onSubmitHandler = async (e) => {
  e.preventDefault();
  const toastId = toast.loading(`${state} in progress...`);

  try {
    axios.defaults.withCredentials = true;

    const url =
      state === "Sign Up"
        ? `${backendUrl}/api/auth/register`
        : `${backendUrl}/api/auth/login`;

    let response;

    if (state === "Sign Up") {
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      if (coverImage) {
        data.append("coverImage", coverImage); // 🔁 your file input state
      }

      response = await axios.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await axios.post(url, { email, password });
    }

    const data = response.data;

    if (data.success) {
      setIsLoggedin(true);
      getUserData();
      toast.update(toastId, {
        render: state === "Sign Up" ? "Registration successful!" : "Login successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
      navigate("/");
    } else {
      toast.update(toastId, {
        render: data.message || "Failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  } catch (err) {
    toast.update(toastId, {
      render: err?.response?.data?.message || "Something went wrong",
      type: "error",
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
    });
  }
};


  return (
<Box className="min-h-screen flex justify-center items-center bg-[#F9F9F9] px-4">
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "#ffffff", // white card
color: "#1e293b",           // slate-800 for readable dark text

        }}
      >
        <Typography variant="h5" sx={{ color: "black", mb: 1 }}>
          {state === "Sign Up" ? "Create Account" : "Login"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {state === "Sign Up"
            ? "Create your account!"
            : "Login to your account!"}
        </Typography>

       <form onSubmit={onSubmitHandler}>
  <Box display="flex" flexDirection="column" gap={2}>
    {state === "Sign Up" && (
      <>
        {/* Avatar Upload + Preview */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <ButtonBase
            component="label"
            sx={{
              borderRadius: "50%",
              width: 80,
              height: 80,
              overflow: "hidden",
              position: "relative",
              '&:has(:focus-visible)': {
                outline: "2px solid",
                outlineOffset: "2px",
              },
            }}
          >
            <Avatar
              src={avatarPreview}
              alt="Upload avatar"
              sx={{ width: 80, height: 80 }}
            />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleCoverImageChange}
            />
          </ButtonBase>
        </Box>

        {/* Optional: Show file name */}
        {coverImage && (
          <Typography
            variant="caption"
            sx={{ textAlign: "center", color: "gray", fontStyle: "italic", mb: 1 }}
          >
            Selected: {coverImage.name}
          </Typography>
        )}

        {/* Name Field */}
        <TextField
          variant="outlined"
          label="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </>
    )}

    {/* Email */}
    <TextField
      variant="outlined"
      label="Email"
      type="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      fullWidth
    />

    {/* Password */}
    <TextField
      variant="outlined"
      label="Password"
      type="password"
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      fullWidth
    />

    {/* Forgot Password */}
    <Typography
      onClick={() => navigate("/reset-password")}
      variant="body2"
      sx={{
        cursor: "pointer",
        color: "green",
        textAlign: "right",
        mt: 0.5,
      }}
    >
      Forgot password?
    </Typography>

    {/* Submit */}
    <Button
      type="submit"
      variant="contained"
      fullWidth
      sx={{
        background: "linear-gradient(to right, #4ade80, #15803d)",
        mt: 1,
      }}
    >
      {state}
    </Button>
  </Box>
</form>



        <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                style={{ color: "#4ade80", cursor: "pointer", textDecoration: "underline" }}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                style={{ color: "#4ade80", cursor: "pointer", textDecoration: "underline" }}
              >
                Sign Up
              </span>
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
