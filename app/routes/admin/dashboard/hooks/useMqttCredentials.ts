import { useCallback, useEffect, useRef, useState } from "react";
import apiClient from "~/configs/axios";
import { useDialog } from "~/components/providers/DialogProvider";

export interface MqttCredentials {
  carMqttUsername: string;
  decryptedMqttPassword: string;
}

type CredentialFieldKey = "carId" | "username" | "password";

interface UseMqttCredentialsOptions {
  isOpen: boolean;
  carId: string;
}

/**
 * Loads / resets the MQTT credentials shown by `CredentialModal`.
 *
 * Credentials are fetched only while the modal is open and cleared on close so
 * a decrypted password never lingers in memory (or in the DOM) after dismissal.
 */
export function useMqttCredentials({
  isOpen,
  carId,
}: UseMqttCredentialsOptions) {
  const { confirm, alert } = useDialog();

  const [credentials, setCredentials] = useState<MqttCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const fetchCredentials = useCallback(async () => {
    if (!carId) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get(`/cars/mqtt-credentials/${carId}`);
      if (res.data.success) {
        setCredentials(res.data.data);
      } else {
        setError(res.data.message || "Failed to load credentials");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "ไม่สามารถโหลดข้อมูล Credentials ได้",
      );
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    if (isOpen) {
      fetchCredentials();
      setShowPassword(false);
      setCopiedField(null);
    } else {
      setCredentials(null);
      setError(null);
    }
  }, [isOpen, carId, fetchCredentials]);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const copyField = useCallback((value: string, field: CredentialFieldKey) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = window.setTimeout(
      () => setCopiedField(null),
      1500,
    );
  }, []);

  const requestReset = useCallback(() => {
    confirm({
      title: "รีเซ็ต Credentials",
      description:
        "คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ต MQTT Credentials สำหรับรถคันนี้? ข้อมูลเก่าจะใช้ไม่ได้อีกต่อไป",
      confirmText: "รีเซ็ตเลย",
      cancelText: "ยกเลิก",
      variant: "destructive",
      onConfirm: async () => {
        try {
          setIsLoading(true);
          const res = await apiClient.post(
            `/cars/mqtt-credentials/${carId}/reset`,
          );
          if (res.data.success) {
            fetchCredentials();
            alert({
              title: "รีเซ็ตข้อมูลสำเร็จ",
              description: "รีเซ็ตข้อมูล Credentials เรียบร้อยแล้ว",
            });
          }
        } catch (err: any) {
          alert({
            title: "เกิดข้อผิดพลาด",
            description:
              err.response?.data?.message || "ไม่สามารถรีเซ็ต Credentials ได้",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  }, [alert, carId, confirm, fetchCredentials]);

  return {
    credentials,
    username: credentials?.carMqttUsername || "",
    password: credentials?.decryptedMqttPassword || "",
    isLoading,
    error,
    showPassword,
    copiedField,
    refetch: fetchCredentials,
    togglePassword,
    copyField,
    requestReset,
  };
}
