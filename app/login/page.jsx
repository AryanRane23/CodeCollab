"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import styled from "styled-components";

export default function Login() {
  return (
    <StyledWrapper>
      <form className="form">
        <div className="text-center text-3xl font-semibold">Login</div>

        {/* Google Login */}
        <div className="flex-row">
          <button
            type="button"
            className="btn google"
            onClick={() =>
              signIn("google", { callbackUrl: "/home", prompt: "select_account" })
            }
          >
            <div className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 533.5 544.3"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M533.5 278.4c0-18.5-1.7-36.4-5-53.6H272v101.5h146.9c-6.3 34.1-25.2 63-53.7 82.4v68h86.8c50.8-46.8 81.5-115.8 81.5-198.3z"
                />
                <path
                  fill="#34A853"
                  d="M272 544.3c72.9 0 134.1-24.1 178.7-65.5l-86.8-68c-24.1 16.2-54.9 25.7-91.9 25.7-70.7 0-130.6-47.7-152.1-111.5H30.5v70.1C73.9 486.7 167.8 544.3 272 544.3z"
                />
                <path
                  fill="#FBBC04"
                  d="M119.9 324.9c-10.2-30.5-10.2-63.5 0-94l.1-70.1H30.5C11 197.6 0 234.8 0 272.3s11 74.7 30.5 111.6l89.4-69z"
                />
                <path
                  fill="#EA4335"
                  d="M272 106.6c39.6-.6 77.6 14 106.6 41.1l79.6-79.6C408.8 24.2 344.3 0 272 0 167.8 0 73.9 57.6 30.5 160.6l89.4 69c21.4-63.8 81.3-111.6 152.1-111.6z"
                />
              </svg>
            </div>
            Login with Google
          </button>
        </div>

        {/* GitHub Login */}
        <div className="flex-row">
          <button
            type="button"
            className="btn github"
            onClick={() => signIn("github", { callbackUrl: "/home" })}
          >
            <div className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.76-1.605-2.665-.3-5.467-1.335-5.467-5.93 0-1.31.47-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.81 1.102.81 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </div>
            Login with GitHub
          </button>
        </div>

        {/* Footer */}
        <p className="p">
          Don’t have an account?
          <Link href="/signup" className="span">
            Sign up
          </Link>
        </p>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #ffffff;
    padding: 30px;
    width: 290px;
    border-radius: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .flex-row {
    display: flex;
    gap: 10px;
  }

  .btn {
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1.5px solid #2d79f3;
  }
`;
