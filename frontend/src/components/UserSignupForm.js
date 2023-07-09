import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useBooksContext } from "../provider/BookProvider";
import { StepsProvider, Steps, useSteps } from "react-step-builder";
import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import { Controller, useForm } from "react-hook-form";
import Page404 from "./Page404";
import "react-phone-input-2/lib/bootstrap.css";
import "../styles/input-phone.css";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { signupUser } from "../features/AuthFeatures";

function UserSignupForm() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const signupWith = params.get("with");
    const { isUser, notify } = useBooksContext();
    const [ipData, setIpData] = useState({});
    const [progressDetails, setProgressDetails] = useState({
        current: 0,
        total: 0,
    });
    const {
        getValues,
        control,
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm();

    const handleSignupByPhone = async (data) => {
        // confirm the user
        const confirmationResult = window.confirmationResult;
        confirmationResult
            .confirm(data.otp)
            .then(async (result) => {
                // User signed in successfully.
                const user = result.user;
                console.log(user.uid);
                const { status, json } = await signupUser(
                    { ...data, uid: user.uid },
                    {
                        signupWith,
                        create: true,
                    }
                );
                if (status === 200) {
                    localStorage.setItem(
                        "accountDetail",
                        JSON.stringify(json.userDetails)
                    );
                }
                console.log("user :", user);
                // ...
            })
            .catch((error) => {
                // User couldn't sign in (bad verification code?)
                notify("error", "Wrong OTP. Try again...");
                console.log("error: ", error);
                // ...
            });
    };

    const handleOTP = (next) => {
        handleSubmit(async (data) => {
            const { status, json } = await signupUser(data, {
                check: true,
            });
            if (status === 200) {
                const appVerifier = window.recaptchaVerifier;
                signInWithPhoneNumber(auth, "+" + data.phoneNumber, appVerifier)
                    .then((confirmationResult) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).
                        window.confirmationResult = confirmationResult;
                        window.scroll(0, 0);
                        console.log("confirmationResult: ", confirmationResult);
                        next();
                    })
                    .catch((error) => {
                        // Error; SMS not sent
                        // ...
                        // reset recapcha
                        console.log("error: ", error);
                        notify(
                            "error",
                            "Error while sending OTP. Try again..."
                        );
                        window.recaptchaVerifier
                            .render()
                            .then(function (widgetId) {
                                window.recaptchaVerifier.reset(widgetId);
                            });
                    });
            } else if (status === 400) {
                notify("error", json.errors[0].msg);
            }
        })();
    };

    const onSubmit = async (data) => {
        const { status, json } = await signupUser(data, { check: true });

        if (status === 200) {
            if (signupWith === "phone") {
                handleSignupByPhone(data);
            }
            // Todo: Add remaining
        } else if (status === 400) {
            notify("error", json.errors[0].msg);
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log("errors: ", errors);
    };

    const nextHandle = async (next) => {
        const isValid = await trigger();
        if (isValid && progressDetails.current < 3) {
            if (progressDetails.current === 2 && signupWith === "phone") {
                handleOTP(next);
                // handleSubmit(handleOTP)(next);
                window.scroll(0, 0);
            } else {
                next();
            }
        } else {
            handleSubmit(onSubmit)();
        }
    };

    useEffect(() => {
        if (isUser) {
            navigate("/");
        }

        // eslint-disable-next-line
    }, [isUser]);

    useEffect(() => {
        if (!isUser) {
            fetch("https://freeipapi.com/api/json", {
                method: "GET",
            })
                .then((response) => response.json())
                .then((data) => {
                    setIpData(data);
                })
                .catch((error) => {
                    console.log(error);
                });

            window.recaptchaVerifier = new RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: (response) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                        console.log("Captcha Resolved");
                    },
                },
                auth
            );
        }
    }, []);

    return (
        <>
            {/* {signupWith ? ( */}
            <div className="text-gray mx-auto" style={{ maxWidth: "500px" }}>
                <StepsProvider>
                    <div id="recaptcha-container"></div>
                    <form
                        noValidate
                        id="signupForm"
                        onSubmit={handleFormSubmit}
                    >
                        <MultiStepForm
                            ipData={ipData}
                            register={register}
                            errors={errors}
                            control={control}
                            nextHandle={nextHandle}
                            setProgressDetails={setProgressDetails}
                            getValues={getValues}
                        />
                    </form>
                </StepsProvider>
            </div>
            {/* ) : (
                <Page404 />
            )} */}
        </>
    );
}

const MultiStepForm = (props) => {
    const [params] = useSearchParams();
    const signupWith = params.get("with");
    const {
        register,
        errors,
        control,
        nextHandle,
        setProgressDetails,
        getValues,
    } = props;
    const { prev, next, total, current, jump } = useSteps();

    useEffect(() => {
        setProgressDetails({ current, total });
    }, [current, total]);

    // const handleOnBlur = (e) => {
    //     // const elem = e.target;
    //     // if (elem.name === "name") {
    //     //     if (data.name.trim().length < 5) {
    //     //         elem.classList.add("is-invalid");
    //     //         setIsValidated(false);
    //     //     } else {
    //     //         elem.classList.remove("is-invalid");
    //     //         // setisValidated(true);
    //     //     }
    //     // } else if (elem.name === "email") {
    //     //     const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    //     //     const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //     //     if (!regex.test(data.email)) {
    //     //         elem.classList.add("is-invalid");
    //     //         setIsValidated(false);
    //     //     } else {
    //     //         elem.classList.remove("is-invalid");
    //     //         // setisValidated(true);
    //     //     }
    //     // } else if (elem.name === "password") {
    //     //     if (data.password.trim().length < 8) {
    //     //         elem.classList.add("is-invalid");
    //     //         setIsValidated(false);
    //     //     } else {
    //     //         elem.classList.remove("is-invalid");
    //     //         // setisValidated(true);
    //     //     }
    //     // } else if (elem.name === "confirmPassword") {
    //     //     if (data.password.trim() !== data.confirmPassword.trim()) {
    //     //         elem.classList.add("is-invalid");
    //     //         setIsValidated(false);
    //     //     } else {
    //     //         elem.classList.remove("is-invalid");
    //     //         // setisValidated(true);
    //     //     }
    //     // }
    // };

    // const handleOnFocus = (e) => {
    //     // const elem = e.target;
    //     // if (elem.name === "name") {
    //     //     elem.classList.remove("is-invalid");
    //     // } else if (elem.name === "email") {
    //     //     elem.classList.remove("is-invalid");
    //     // } else if (elem.name === "password") {
    //     //     elem.classList.remove("is-invalid");
    //     // } else if (elem.name === "confirmPassword") {
    //     //     elem.classList.remove("is-invalid");
    //     // }
    // };

    // const nextHandle = (e) => {
    //     next();
    //     window.scroll(0, 0);
    // };

    return (
        <>
            <div className="d-flex w-100">
                <div onClick={prev} className="cursor-pointer">
                    <i className="fa-solid fa-left-long fs-5"></i>
                </div>
            </div>
            <div
                className="progress mb-3"
                role="progressbar"
                aria-valuenow={(current / total) * 100}
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <div
                    className="progress-bar bg-sea-green"
                    style={{ width: `${(current / total) * 100}%` }}
                >
                    {current} of {total}
                </div>
            </div>

            {signupWith === "email" ? (
                <Steps>
                    <UserInfo
                        signupWith={signupWith}
                        ipData={props.ipData}
                        register={register}
                        errors={errors}
                        control={control}
                    />
                    <OrderInfo register={register} errors={errors} />
                    <EmailSignupSuccessful />
                </Steps>
            ) : null}
            {signupWith === "phone" ? (
                <Steps>
                    <UserInfo
                        signupWith={signupWith}
                        ipData={props.ipData}
                        register={register}
                        errors={errors}
                        control={control}
                    />
                    <OrderInfo register={register} errors={errors} />
                    <PhoneNumberVerification
                        control={control}
                        errors={errors}
                        getValues={getValues}
                    />
                </Steps>
            ) : null}
            <div className="d-flex justify-content-end">
                <button
                    onClick={() => nextHandle(next)}
                    className="btn btn-fill-sea-green d-inline-flex justify-content-between align-items-center"
                >
                    {current !== total ? (
                        <>
                            <span className="me-2">Next &rarr;</span>
                            {/* <i className="fa-solid fa-right-long"></i> */}
                        </>
                    ) : signupWith === "phone" ? (
                        <span className="me-2">Verify</span>
                    ) : (
                        <span>Continue Shopping</span>
                    )}
                </button>
            </div>
        </>
    );
};

const UserInfo = (props) => {
    const { register, errors, control, ipData, signupWith } = props;

    return (
        <div className="step">
            <h3 className="fw-bold fs-5">General Info</h3>
            <em>Note: Name, email, phone cannot be change later.</em>
            <div className="mb-2" style={{ height: "95px" }}>
                <label htmlFor="userName" className="form-label fw-medium">
                    Name
                </label>
                <input
                    type="text"
                    className={`form-control ${
                        errors.name ? "is-invalid" : ""
                    }`}
                    id="userName"
                    {...register("name", {
                        required: "Name is required",
                        minLength: {
                            value: 5,
                            message: "Name must be at least 5 characters",
                        },
                    })}
                />
                <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="mb-2" style={{ height: "95px" }}>
                <label htmlFor="userEmail" className="form-label fw-medium">
                    Email address
                </label>
                <input
                    type="email"
                    className={`form-control ${
                        errors.email ? "is-invalid" : ""
                    }`}
                    id="userEmail"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email is not vaild",
                        },
                    })}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
            <div className="row">
                <div className="mb-3 col col-12">
                    <label
                        htmlFor="userPhoneNumber"
                        className="form-label fw-medium"
                    >
                        Phone Number
                    </label>
                    {signupWith === "phone" && (
                        <>
                            <br />
                            <em>You will recieve OTP to verify the number.</em>
                        </>
                    )}
                    <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{ required: "Phone number is required" }}
                        render={({ field }) => (
                            <PhoneInput
                                inputClass={`px-5 ${
                                    errors.phoneNumber ? "is-invalid" : ""
                                }`}
                                inputProps={{
                                    id: "userPhoneNumber",
                                    name: "phoneNumber",
                                    required: true,
                                }}
                                inputRef={field.ref}
                                onChange={field.onChange}
                                value={field.value}
                                country={ipData.countryCode?.toLowerCase()}
                            />
                        )}
                    />
                </div>
            </div>
            <div className="mb-2" style={{ height: "95px" }}>
                <label htmlFor="userPassword" className="form-label fw-medium">
                    Password
                </label>
                <input
                    type="password"
                    className={`form-control ${
                        errors.password ? "is-invalid" : ""
                    }`}
                    id="userPassword"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                    })}
                />
                <div className="invalid-feedback">
                    {errors.password?.message}
                </div>
            </div>
            <div className="mb-2" style={{ height: "95px" }}>
                <label
                    htmlFor="userConfirmPassword"
                    className="form-label fw-medium"
                >
                    Confirm Password
                </label>
                <input
                    type="password"
                    className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    id="userConfirmPassword"
                    {...register("confirmPassword", {
                        validate: (value, formValues) =>
                            value === formValues.password ||
                            "Password not matched.",
                    })}
                />
                <div className="invalid-feedback">
                    Confirm password not matched.
                </div>
            </div>
        </div>
    );
};

const OrderInfo = (props) => {
    const { register, errors } = props;

    return (
        <div className="step">
            <h3 className="fw-bold fs-5">Order Info</h3>
            <div className="row">
                <div className="mb-4 col col-12 col-sm-6">
                    <label
                        htmlFor="userCountry"
                        className="form-label fw-medium"
                    >
                        Country
                    </label>
                    <input
                        className={`form-control ${
                            errors.password ? "is-invalid" : ""
                        }`}
                        list="datalistCountryOptions"
                        id="userCountry"
                        {...register("shippingAddress.country", {
                            required: "Country is required",
                        })}
                        placeholder="Type to search..."
                    />
                    <datalist id="datalistCountryOptions">
                        <option value="Pakistan" />
                        <option value="India" />
                        <option value="Afghanistan" />
                        <option value="United States of America" />
                        <option value="Canada" />
                    </datalist>
                </div>
                <div className="mb-4 col col-12 col-sm-6">
                    <label htmlFor="userState" className="form-label fw-medium">
                        State/Province
                    </label>
                    <input
                        className={`form-control ${
                            errors.password ? "is-invalid" : ""
                        }`}
                        list="datalistStateOptions"
                        id="userState"
                        {...register("shippingAddress.state", {
                            required: "State is required",
                        })}
                        placeholder="Type to search..."
                    />
                    <datalist id="datalistStateOptions">
                        <option value="Punjab" />
                        <option value="Sindh" />
                        <option value="Balochistan" />
                        <option value="Khyber Pakhtun Khawa" />
                        <option value="Jammu & Kashmir" />
                    </datalist>
                </div>
            </div>
            <div className="row">
                <div className="mb-4 col col-12 col-sm-8">
                    <label htmlFor="userCity" className="form-label fw-medium">
                        City
                    </label>
                    <input
                        className={`form-control ${
                            errors.password ? "is-invalid" : ""
                        }`}
                        list="datalistCityOptions"
                        id="userCity"
                        {...register("shippingAddress.city", {
                            required: "City is required",
                        })}
                        placeholder="Type to search..."
                    />
                    <datalist id="datalistCityOptions">
                        <option value="San Francisco" />
                        <option value="New York" />
                        <option value="Seattle" />
                        <option value="Los Angeles" />
                        <option value="Chicago" />
                    </datalist>
                </div>
                <div className="mb-4 col col-12 col-sm-4">
                    <label
                        htmlFor="userPostalCode"
                        className="form-label fw-medium"
                    >
                        Postal/Zip Code
                    </label>
                    <input
                        type="number"
                        className={`form-control ${
                            errors.password ? "is-invalid" : ""
                        }`}
                        id="userPostalCode"
                        {...register("shippingAddress.postalCode", {
                            required: "Postal/Zip code is required",
                        })}
                        required
                    />
                    <div className="valid-feedback">Looks good!</div>
                </div>
            </div>
            <div className="mb-4">
                <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label fw-medium"
                >
                    Address
                </label>
                <input
                    type="text"
                    className={`form-control ${
                        errors.password ? "is-invalid" : ""
                    }`}
                    id="exampleFormControlInput1"
                    {...register("shippingAddress.address", {
                        required: "Address is required",
                    })}
                    required
                />
                <div className="valid-feedback">Looks good!</div>
            </div>
        </div>
    );
};

const PhoneNumberVerification = (props) => {
    const { getValues, control, errors } = props;

    return (
        <div
            className="mt-5 mb-4 text-center mx-auto"
            style={{ maxWidth: "325px" }}
        >
            <h2 className="fw-bold">Verification</h2>
            <p className="">
                Please enter the verification code sent to{" "}
                <strong>+{getValues("phoneNumber")}</strong>
            </p>
            <Controller
                name="otp"
                control={control}
                rules={{ required: "OTP number is required" }}
                render={({ field }) => (
                    <>
                        <OtpInput
                            value={field.value}
                            onChange={field.onChange}
                            numInputs={6}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={`form-control otp-input px-1 mx-1 ${
                                errors.otp ? "is-invalid" : ""
                            }`}
                            containerStyle="justify-content-center mt-5 mb-4"
                        />
                        <div className="invalid-feedback">
                            {errors.otp?.message}
                        </div>
                    </>
                )}
            />
            <p>
                Didn't recieve the OTP?{" "}
                <button type="button" className="btn btn-link pt-0">
                    Resend
                </button>
            </p>
        </div>
    );
};

const EmailSignupSuccessful = () => {
    return (
        <div class="">
            {/* <div class="card-header"> */}
            <h3>Congratulations! Your account is created.</h3>
            {/* </div> */}
            {/* <div class="card-body"> */}
            <p>
                An email has been sent to the specified email address. Please
                check your inbox and follow the instructions to verify your
                email.
            </p>
            {/* </div> */}
            {/* <div class="card-footer"> */}
            <small>
                If you did not receive the email, please check your spam folder
                or contact support.
            </small>
            {/* </div> */}
        </div>
    );
};

export default UserSignupForm;
