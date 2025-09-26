import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FormInput } from "../components/index.js";
import deviceWidth from "../utils/deviceWidth.js";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";
import axios from "axios";

function Login() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const isMobile = deviceWidth();

  const login = async (data) => {

    let loginData;
    if (emailPattern.test(data.emailorusername)) {
      loginData = {
        email: data.emailorusername,
        password: data.password,
      };
    } else {
      loginData = {
        username: data.emailorusername,
        password: data.password,
      };
    }
    console.log("Login Data: ", loginData);

    try {
      await axios
        .post("api/v1/users/login", loginData)
        .then((response) => {
          console.log("Login response: ", response.data);
          console.log(response.status);
          if (response.status === 200) {
            console.log("User Data: ", response.data.data.user);
            dispatch(authLogin(response.data.data.user));
            console.log(response.data.message);
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Login error: ", error);
          console.log("Error status: ", error.status);
        });
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    <div className="login-page min-h-screen max-w-screen bg-black relative">
      <div
        className={`container ${
          isMobile ? "w-[80%]" : "w-[500px]"
        }   bg-transparent border border-white rounded-lg p-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
      >
        <h2 className="text-gray-200 font-bold text-2xl text-center mb-4">
          Login
        </h2>
        <h2 className="text-base text-gray-200 font-semibold text-center ">
          If you don't have an Account, Click to
          <span className="text-blue-500">
            <Link to={"/signup"}> SignUp</Link>
          </span>
        </h2>
        <form
          onSubmit={handleSubmit(login)}
          className="login-form m-6 flex flex-col gap-6"
        >
          <FormInput
            type="text"
            placeholder="Enter your email or username"
            className="border p-4 text-base text-gray-200"
            inputClassname="w-full"
            {...register("emailorusername", { required: "Email/Username is required" })}
          />
          {errors.emailorusername && (
            <p className="text-red-500 text-sm text-center">
              {errors.emailorusername.message}
            </p>
          )}

          <FormInput
            type="password"
            placeholder="Enter your password"
            className="border p-2 text-base text-gray-200"
            inputClassname="w-full "
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm text-center">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-500 rounded-lg text-white p-2"
          >
            Login
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default Login;
