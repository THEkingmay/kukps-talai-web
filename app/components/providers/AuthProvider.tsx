import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "~/types";
import {
  loginAction,
  loginWithSessionAction,
  registerAction,
  logoutAction,
} from "~/actions/auth.action";
import { updateProfileAction } from "~/actions/user.action";
import { useDialog } from "./DialogProvider";

interface AuthContextProps {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    invite_code: string,
  ) => Promise<void>;
  updateProfile: (
    firstName: string | null,
    lastName: string | null,
    profileImage: File | null,
    phoneNumber: string | null,
  ) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  isLoading: false,
  login: async (_email, _password) => {},
  logout: async () => {},
  register: async (_email, _password, _invite_code) => {},
  updateProfile: async (
    _firstName,
    _lastName,
    _profileImage,
    _phoneNumber,
  ) => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { alert } = useDialog();

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const result = await loginWithSessionAction();
      if (result.success) {
        setUser(result.data.user);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await loginAction(email, password);
    setIsLoading(false);

    if (!result.success) {
      alert({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: result.error,
      });
      return;
    }

    setUser(result.data.user);
  };

  const register = async (
    email: string,
    password: string,
    invite_code: string,
  ) => {
    setIsLoading(true);
    const result = await registerAction(email, password, invite_code);
    setIsLoading(false);

    if (!result.success) {
      alert({
        title: "สมัครสมาชิกไม่สำเร็จ",
        description: result.error,
      });
      return;
    }

    setUser(result.data.user);
    alert({ title: "สมัครสมาชิกสำเร็จ" });
  };

  const logout = async () => {
    setIsLoading(true);
    await logoutAction();
    setIsLoading(false);
    setUser(null);
  };

  const updateProfile = async (
    firstName: string | null,
    lastName: string | null,
    profileImage: File | null,
    phoneNumber: string | null,
  ) => {
    if (!user) return;
    const result = await updateProfileAction(
      user.id,
      firstName,
      lastName,
      profileImage,
      phoneNumber,
    );

    if (!result.success) {
      alert({
        title: "อัปเดตโปรไฟล์ไม่สำเร็จ",
        description: result.error,
      });
      return;
    }
    setUser(result.data.user);
  };

  return (
    <AuthContext.Provider
      value={{ isLoading, login, logout, register, updateProfile, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
