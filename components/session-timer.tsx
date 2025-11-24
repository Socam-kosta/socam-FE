// ========== 세션 타이머 컴포넌트 ==========
// 로그인 세션 만료 시간 표시 및 연장 기능

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";
import { getValidToken, getTimeUntilExpiration, formatTimeRemaining } from "@/lib/auth-utils";
import { refreshAccessToken } from "@/lib/api/auth";

interface SessionTimerProps {
  onSessionExpired?: () => void;
}

export default function SessionTimer({ onSessionExpired }: SessionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // 토큰 만료 시간 확인 및 업데이트
  const updateTimeRemaining = () => {
    const token = getValidToken();
    if (!token) {
      setTimeRemaining(null);
      return;
    }

    const timeLeft = getTimeUntilExpiration(token);
    setTimeRemaining(timeLeft);

    // 10분 이하 남았을 때 경고 표시
    if (timeLeft !== null && timeLeft > 0 && timeLeft <= 10 * 60 * 1000) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    // 만료된 경우
    if (timeLeft === 0 || timeLeft === null) {
      if (onSessionExpired) {
        onSessionExpired();
      }
    }
  };

  // 토큰 연장
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshAccessToken();
      // 토큰 갱신 후 시간 업데이트
      updateTimeRemaining();
      setShowWarning(false);
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      alert(error instanceof Error ? error.message : "세션 연장에 실패했습니다.");
      if (onSessionExpired) {
        onSessionExpired();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // 초기 로드 및 주기적 업데이트
  useEffect(() => {
    updateTimeRemaining();

    // 1분마다 업데이트
    const interval = setInterval(updateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, []);

  // 토큰이 없으면 표시하지 않음
  if (timeRemaining === null) {
    return null;
  }

  // 만료된 경우
  if (timeRemaining === 0) {
    return null;
  }

  const formattedTime = formatTimeRemaining(timeRemaining);

  // 컴팩트한 버전 (Header 내부용)
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors">
      <Clock className={`h-3.5 w-3.5 ${showWarning ? "text-destructive" : "text-muted-foreground"}`} />
      <span className={`text-xs ${showWarning ? "text-destructive font-medium" : "text-muted-foreground"}`}>
        {formattedTime}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="h-6 px-1.5 text-xs gap-1"
        title="로그인 연장"
      >
        {isRefreshing ? (
          <>
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span className="hidden sm:inline">연장 중</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">연장</span>
          </>
        )}
      </Button>
    </div>
  );
}

