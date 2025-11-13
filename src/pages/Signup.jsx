import React, { useEffect, useState } from "react";
import { FormInput } from "../components/index.js";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import deviceWidth from "../utils/deviceWidth.js";
import axios from "axios";
import { useForm } from "react-hook-form";
import { GetImageOrVideoPreview } from "../components/index.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice.js";

function Signup() {
  const isMobile = deviceWidth();
  const { register, handleSubmit, control } = useForm();
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [passwordValue, setPasswordValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("api/v1/healthcheck")
      .then((response) => {
        console.log("API is healthy:", response.data.message);
      })
      .catch((error) => {
        console.error("API health check failed:", error.response.data);
      });
  }, []);

  const matchPassowrd = (event) => {
    const confirmPasswordValue = event.target.value;
    if (confirmPasswordValue !== passwordValue) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  // console.log("password matched: ", passwordMatch);

  const signUp = async (data) => {
    console.log("function ran");

    console.log("Data: ", data);
    const userData = new FormData();

    userData.append("username", data.username);
    userData.append("fullName", data.fullName);
    userData.append("email", data.email);
    userData.append("password", data.password);
    console.log(typeof data.coverImage);

    if (data.coverImage) {
      userData.append("coverImage", data.coverImage);
    }

    userData.append("avatar", data.avatar);

    if (userData) {
      try {
        await axios
          .post("api/v1/users/register", userData)
          .then(async (response) => {
            console.log(
              "Checking if user registration was successfull or not",
              response.data.message
            );
            if (response.status === 201) {
              await axios
                .post("api/v1/users/login", {
                  email: data.email,
                  password: data.password,
                })
                .then((response) => {
                  console.log("login response status: ", response.status);
                  console.log("Login response: ", response.data);
                  console.log(response.data.message);
                  if (response.status === 200) {
                    dispatch(login(response.data.user));
                    navigate("/");
                  }
                })
                .catch((error) => {
                  console.error("Error during login:", error);
                });
            }
          })
          .catch((error) => {
            console.error("Error during registration:", error);
          });
      } catch (error) {
        console.error("Error in signUp function:", error);
      }
    }
  };

  return (
    <div className="bg-black min-h-screen max-w-screen flex items-center justify-center">
      <div className="signup-container w-full  m-auto min-h-[80%] bg-transparent rounded-lg flex flex-col items-center p-4 gap-10">
        <div className="signup-form w-full min-h-screen  rounded-lg flex flex-col gap-8">
          <h2 className="text-2xl text-white font-semibold text-center">
            Create an account
          </h2>
          <form onSubmit={handleSubmit(signUp)} className="flex flex-col gap-8">
            <div
              className={`coverImage border border-white rounded-lg w-full ${
                isMobile ? "h-[200px]" : "h-[300px]"
              } relative `}
            >
              <GetImageOrVideoPreview
                name={"coverImage"}
                control={control}
                className={
                  "w-full h-full text-white bg-transparent overflow-hidden flex items-center"
                }
                imgClassName={"rounded-lg w-full h-full object-cover"}
                label={<Plus className="text-white w-[30px] h-[30px]" />}
              />
            </div>
            <div
              className={`input-form w-full flex  gap-8 ${
                isMobile ? "flex-col items-center" : "flex-row"
              }`}
            >
              <div className="w-[200px] h-[200px] border border-white rounded-full border relative">
                <GetImageOrVideoPreview
                  name={"avatar"}
                  control={control}
                  className={
                    "w-full h-full bg-transparent overflow-hidden text-white "
                  }
                  imgClassName={"w-full h-full rounded-full"}
                  label={<Plus className="text-white w-[30px] h-[30px]" />}
                />
              </div>

              <div
                className={`${
                  isMobile ? "w-full" : "w-[calc(100%-200px)]"
                } w-[calc(100%-200px)]  flex flex-col gap-6`}
              >
                <div className="w-full h-[70px] ">
                  <FormInput
                    type={"text"}
                    label="FullName: "
                    placeholder="Enter your fullname"
                    className={`w-full h-[70px] flex flex-row items-center gap-4 text-white`}
                    inputClassname="border border-white text-white w-full gap-2 rounded-lg p-3"
                    {...register("fullName", {
                      required: "FullName is required",
                    })}
                  />
                </div>
                <div className="w-full h-[70px] ">
                  <FormInput
                    type={"email"}
                    label="Email: "
                    placeholder="Enter your email"
                    className={`w-full h-[70px] flex flex-row items-center gap-10 text-white`}
                    inputClassname="border border-white text-white w-full gap-2 rounded-lg p-3"
                    {...register("email", {
                      required: "Email is required",
                      validate: {
                        matchPatern: (value) =>
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                            value
                          ) || "Email address must be a valid address",
                      },
                    })}
                  />
                </div>
                <div className="w-full h-[70px] ">
                  <FormInput
                    type={"text"}
                    label="Username: "
                    placeholder="Enter your userName"
                    className={`w-full h-[70px] flex flex-row items-center gap-4 text-white`}
                    inputClassname="border border-white w-full gap-2 rounded-lg p-3"
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />
                </div>
                <div className="w-full h-[70px] ">
                  <FormInput
                    type={"password"}
                    label="Password: "
                    placeholder="Enter your password"
                    className={`w-full h-[70px] flex flex-row items-center gap-6 text-white`}
                    inputClassname="border border-white w-full gap-2 rounded-lg p-3"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                  />
                </div>
                <div className="w-full h-[70px] ">
                  <FormInput
                    type={"password"}
                    label="Confirm Password: "
                    placeholder="Confirm your password"
                    className={`w-full h-[70px] flex flex-row items-center text-white`}
                    inputClassname="border border-white w-full gap-2 rounded-lg p-3"
                    onChange={(event) => matchPassowrd(event)}
                  />

                  {passwordMatch !== null &&
                    (passwordMatch ? (
                      <span className="text-green-500 text-xl">
                        Password matched
                      </span>
                    ) : (
                      <span className="text-red-600 text-xl">
                        Password didn't match
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="button">
              <button
                className="w-full h-[50px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <p className="text-white text-lg">
          Already have an account; &nbsp;
          <Link to="/login">
            <span className="text-blue-300">Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
