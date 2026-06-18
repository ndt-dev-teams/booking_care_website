import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../api/authService";
import { setUser } from "../../store/slices/authSlice";
import { getRoleSettingsPath } from "../../utils/rolePaths";
import "./VerifyEmailPage.scss";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const currentRole = user?.role;
  const donePath = isAuthenticated ? getRoleSettingsPath(currentRole) : "/auth/login";
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác thực email...");

  useEffect(() => {
    let mounted = true;
    let redirectTimer;

    authService
      .confirmEmailVerification({ token })
      .then((res) => {
        if (!mounted) return;
        const verifiedUser = res.data?.user;

        if (isAuthenticated && user?.id && verifiedUser?.id !== user.id) {
          setStatus("error");
          setMessage("Link xác thực này không thuộc tài khoản đang đăng nhập.");
          return;
        }

        if (isAuthenticated && verifiedUser) {
          dispatch(setUser(verifiedUser));
        }

        setStatus("success");
        setMessage("Email của bạn đã được xác thực thành công.");
        redirectTimer = setTimeout(() => {
          const nextRole = verifiedUser?.role || currentRole;
          navigate(isAuthenticated ? getRoleSettingsPath(nextRole) : "/auth/login", { replace: true });
        }, 2200);
      })
      .catch((error) => {
        if (!mounted) return;
        setStatus("error");
        setMessage(error?.response?.data?.message || "Token xác thực không hợp lệ.");
      });

    return () => {
      mounted = false;
      clearTimeout(redirectTimer);
    };
  }, [currentRole, dispatch, isAuthenticated, navigate, token, user?.id]);

  return (
    <div className="verify-email-page">
      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-header">
            <span className="verify-icon">
              {status === "loading" ? "…" : status === "success" ? "✓" : "!"}
            </span>
            <h1>{status === "success" ? "Xác thực thành công" : "Xác thực email"}</h1>
            <p className="subtitle">{message}</p>
          </div>

          <div className="text-center">
            <Link to={donePath} className="btn btn-primary">
              {isAuthenticated ? "Quay lại cài đặt" : "Quay lại đăng nhập"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
