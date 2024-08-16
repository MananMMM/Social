import { MDBInput, MDBCardBody, MDBCard, MDBSwitch } from "mdb-react-ui-kit";
import { useState } from "react";
import { handleChangeLogin, handleChangePass } from "../../helpers/api";
import { useForm } from "react-hook-form";
import { PartialUser } from "../../helpers/types";
import { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { verifyUser } from "../../helpers/api";
import { useNavigate } from "react-router-dom";
import { handlePrivate } from "../../helpers/api";

export const Settings = () => {
  const { register, handleSubmit } = useForm<PartialUser>();

  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const handleForm: SubmitHandler<PartialUser> = (user) => {
    handleChangePass(user).then((response) => {
      if (response.status == "error" && response.message) {
        setError(response.message);
      } else {
        setError("");
        navigate("/login");
      }
    });

    handleChangeLogin(user).then((response) => {
      if (response.status == "error" && response.message) {
        setError(response.message);
      } else {
        setError("");
        navigate("/login");
      }
    });
  };

  const [isPrivate, setPrivate] = useState<number>(0);

  useEffect(() => {
    const PrivacySet = async () => {
      const response = await verifyUser();
      if (response.user) {
        setPrivate(response.user.isPrivate);
      }
    };
    PrivacySet();
  }, []);

  const handlePrivacyChange = async () => {
    const status = isPrivate === 0 ? 1 : 0;
    const response = await handlePrivate({ isPrivate: status });

    if (response.status === "error" && response.message) {
      setError(response.message);
    } else {
      setPrivate(status);
      setError("");
    }
  };

  return (
    <>
      <MDBCard className="my-2 rounded-3" style={{ maxWidth: "2200px",backgroundColor:"rgb(227, 220, 230)"}}>
        <MDBCardBody className="px-5" >
          <h1>Settings</h1>
          <br />
          <h4>Account privacy</h4>
          <MDBSwitch
            id="publicPrivateSwitch"
            label={`${isPrivate === 1 ? "Private" : "Public"}`}
            checked={isPrivate === 1}
            onChange={handlePrivacyChange}
            style={{
              backgroundColor: isPrivate === 1 ? "#f8d7da" : "#d1ecf1",
              color: "#000",
              padding: "10px",
            }}
          />

          <h4>Change your password</h4>
          <form onSubmit={handleSubmit(handleForm)}>
            {error && <p className="alert alert-danger">{error}</p>}
            <MDBInput
              wrapperClass="mb-4"
              placeholder="Old Password"
              type="text"
              style={{ maxWidth: "600px" }}
              {...register("old")}
            />
            <br />
            <MDBInput
              wrapperClass="mb-4"
              placeholder="New password"
              type="text"
              style={{ maxWidth: "600px" }}
              {...register("newpwd")}
            />

            <button className="btn btn-outline-info my-3">Save</button>

            <h4>Change your login</h4>
            <MDBInput
              wrapperClass="mb-4"
              placeholder="New Login"
              type="text"
              style={{ maxWidth: "600px" }}
              {...register("login")}
            />

            <br />
            <MDBInput
              wrapperClass="mb-4"
              placeholder="Enter your password"
              type="password"
              style={{ maxWidth: "600px" }}
              {...register("password")}
            />
            <button className="btn btn-outline-info my-3">Save</button>
          </form>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};
