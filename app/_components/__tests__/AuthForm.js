import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "../AuthForm"
import "@testing-library/jest-dom";

describe("AuthForm Component", () => {

  beforeEach(() => {
    render(<AuthForm />);
  })

  it("initially displays login form", () => {

    expect(screen.getByText("Log In", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i, { selector: "input" })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: "input" })).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirm password/i)).not.toBeInTheDocument();
  });


  it("switches to sign up form when sign up button is clicked", () => {

    fireEvent.click(screen.getByText(/Sign Up/i, { selector: "button" }));

    expect(screen.getByText("Sign Up", { selector: "p" })).toBeInTheDocument();;
    expect(screen.getByLabelText("Email", { selector: "input" })).toBeInTheDocument();
    expect(screen.getByLabelText("Password", { selector: "input" })).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password", { selector: "input" })).toBeInTheDocument();
  });

  it("validates the email", () => {
    const emailInput = screen.getByLabelText("Email", { selector: "input" });

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.blur(emailInput);
    expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument();
  });

  it("validates passwords", () => {

    fireEvent.click(screen.getByText("Sign Up", { selector: "button" }));

    const passwordInput = screen.getByLabelText("Password", { selector: "input" });

    fireEvent.change(passwordInput, { target: { value: "weak" } });
    fireEvent.blur(passwordInput);

    expect(screen.getByText(/Password must be at least 8 characters and contain at least 1 uppercase, lowercase, special character, and number./i)).toBeInTheDocument();
  });

  it("checks for matching passwords", () => {

    const signUpButton = screen.getByText("Sign Up", { selector: "button" })
    fireEvent.click(signUpButton);
    const passwordInput = screen.getByLabelText("Password", { selector: "input" });
    const confirmPasswordInput = screen.getByLabelText("Confirm Password", { selector: "input" });

    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Password123?" } });

    fireEvent.blur(confirmPasswordInput);
    expect(screen.getByText(/Passwords do not match!/i)).toBeInTheDocument();
    expect(signUpButton).toBeDisabled();
  });

  it("shows password when visibility icon is clicked", () => {
    ``

    const visibilityButton = screen.getByLabelText(/toggle password visibility/i);
    fireEvent.click(visibilityButton);

    const passwordInput = screen.getByLabelText("Password", { selector: "input" });

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("checks that the login form is ready to submit", () => {

    const loginButton = screen.getByText("Log In", { selector: "button" });
    const emailInput = screen.getByLabelText("Email", { selector: "input" });
    const passwordInput = screen.getByLabelText(/password/i, { selector: "input" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    expect(loginButton).not.toBeDisabled();
  });

  it("checks that the signup form is ready to submit", () => {

    fireEvent.click(screen.getByText("Sign Up", { selector: "button" }))

    const signUpButton = screen.getByText("Sign Up", { selector: "button" })

    const emailInput = screen.getByLabelText("Email", { selector: "input" });
    const passwordInput = screen.getByLabelText("Password", { selector: "input" });
    const confirmPasswordInput = screen.getByLabelText("Confirm Password", { selector: "input" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password123!" }
    })
    expect(signUpButton).not.toBeDisabled();
  })
});
