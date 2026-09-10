"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";

export interface ConsultantStatusPayload {
  consultantId: string;
  activeStatus: boolean;
}

/**
 * Hook to track real-time online/offline presence for a single consultant.
 * Automatically listens to 'consultant:status-changed' socket event.
 */
export function useConsultantStatus(
  consultantId?: string | number | null,
  initialStatus: boolean = false,
  options?: {
    showToastOnChange?: boolean;
    consultantName?: string;
  }
) {
  const [activeStatus, setActiveStatus] = useState<boolean>(initialStatus);

  useEffect(() => {
    setActiveStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    if (!consultantId) return;

    const socket = getSocket();
    if (!socket) return;

    const handleStatusChanged = (payload: ConsultantStatusPayload) => {
      const targetId = String(consultantId);
      const incomingId = String(payload?.consultantId);

      if (incomingId === targetId) {
        console.log(`🟢 Real-time status update for consultant [${targetId}]:`, payload.activeStatus);
        setActiveStatus(payload.activeStatus);

        if (options?.showToastOnChange) {
          const name = options.consultantName || "This consultant";
          if (payload.activeStatus) {
            toast.success(`${name} is now online and available for consultation.`);
          } else {
            toast.info(`${name} just went offline.`);
          }
        }
      }
    };

    socket.on("consultant:status-changed", handleStatusChanged);

    return () => {
      socket.off("consultant:status-changed", handleStatusChanged);
    };
  }, [consultantId, options?.showToastOnChange, options?.consultantName]);

  return {
    activeStatus,
    isOnline: activeStatus,
    setActiveStatus,
  };
}

/**
 * Hook to manage real-time presence for a list or collection of consultants.
 */
export function useConsultantsPresence<
  T extends { _id?: string; id?: string | number; activeStatus?: boolean; [key: string]: any }
>(initialConsultants: T[] = []) {
  const [consultants, setConsultants] = useState<T[]>(initialConsultants);

  useEffect(() => {
    setConsultants(initialConsultants);
  }, [initialConsultants]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleStatusChanged = (payload: ConsultantStatusPayload) => {
      if (!payload?.consultantId) return;

      const targetId = String(payload.consultantId);
      setConsultants((prevList) =>
        prevList.map((item) => {
          const itemId = String(item._id || item.id || "");
          if (itemId === targetId) {
            return {
              ...item,
              activeStatus: payload.activeStatus,
            };
          }
          return item;
        })
      );
    };

    socket.on("consultant:status-changed", handleStatusChanged);

    return () => {
      socket.off("consultant:status-changed", handleStatusChanged);
    };
  }, []);

  return {
    consultants,
    setConsultants,
  };
}
