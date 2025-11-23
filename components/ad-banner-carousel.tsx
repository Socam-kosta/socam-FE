// ========== 광고 배너 캐러셀 ==========
// 위치: 카테고리 네비게이션 바로 아래
// 기능: 5개의 광고 배너를 3초마다 자동 전환, 수동 전환 가능
// 반응형: 모바일/태블릿/데스크톱 대응

"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAllApprovedLectures,
  type LectureResponseDto,
} from "@/lib/api/lecture";

// ========== 배너 데이터 타입 ==========
interface AdBanner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  backgroundColor: string;
}

export default function AdBannerCarousel() {
  // ========== 현재 활성화된 배너 인덱스 ==========
  const [currentIndex, setCurrentIndex] = useState(0);
  const [adBanners, setAdBanners] = useState<AdBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ========== 강의 데이터 로드 ==========
  useEffect(() => {
    const loadLectures = async () => {
      try {
        setIsLoading(true);
        const lectures = await getAllApprovedLectures();

        console.log("로드된 강의 개수:", lectures.length);
        console.log("강의 데이터:", lectures);

        // 최신순으로 정렬 (id가 큰 순서 = 최신)
        const sortedLectures = [...lectures]
          .sort((a, b) => b.id - a.id)
          .slice(0, 10); // 최신 10개 중에서 선택

        // 이미지가 있는 강의를 우선으로, 최소 5개 배너 생성
        // imageUrl이 유효한 URL인지 확인 (빈 문자열, 공백 제외)
        const bannersWithImage = sortedLectures
          .filter((lecture) => {
            const url = lecture.imageUrl?.trim();
            return (
              url &&
              url.length > 0 &&
              (url.startsWith("http") || url.startsWith("/"))
            );
          })
          .slice(0, 5)
          .map((lecture, index) => {
            const imageUrl = lecture.imageUrl?.trim() || "/placeholder.svg";
            console.log(
              `배너 ${index + 1} 강의 ID: ${
                lecture.id
              }, 이미지 URL: ${imageUrl}`
            );
            return {
              id: lecture.id,
              title: lecture.title,
              description:
                lecture.organization || lecture.instructor || "프리미엄 강의",
              imageUrl: imageUrl,
              linkUrl: `/lectures/${lecture.id}`,
              backgroundColor:
                [
                  "bg-blue-50",
                  "bg-purple-50",
                  "bg-orange-50",
                  "bg-green-50",
                  "bg-pink-50",
                ][index] || "bg-blue-50",
            };
          });

        // 이미지가 없는 강의도 포함하여 최소 5개 채우기
        const allBanners = [...bannersWithImage];
        if (
          allBanners.length < 5 &&
          sortedLectures.length > bannersWithImage.length
        ) {
          const remainingLectures = sortedLectures
            .filter((lecture) => {
              const url = lecture.imageUrl?.trim();
              const hasValidImage =
                url &&
                url.length > 0 &&
                (url.startsWith("http") || url.startsWith("/"));
              return (
                !hasValidImage ||
                !bannersWithImage.find((b) => b.id === lecture.id)
              );
            })
            .slice(0, 5 - allBanners.length)
            .map((lecture, index) => ({
              id: lecture.id,
              title: lecture.title,
              description:
                lecture.organization || lecture.instructor || "프리미엄 강의",
              imageUrl: "/placeholder.svg",
              linkUrl: `/lectures/${lecture.id}`,
              backgroundColor:
                [
                  "bg-blue-50",
                  "bg-purple-50",
                  "bg-orange-50",
                  "bg-green-50",
                  "bg-pink-50",
                ][allBanners.length + index] || "bg-blue-50",
            }));
          allBanners.push(...remainingLectures);
        }

        // 최소 5개가 되도록 채우기 (데이터가 부족한 경우)
        while (
          allBanners.length < 5 &&
          sortedLectures.length > allBanners.length
        ) {
          const remaining = sortedLectures.find(
            (lecture) => !allBanners.find((b) => b.id === lecture.id)
          );
          if (remaining) {
            allBanners.push({
              id: remaining.id,
              title: remaining.title,
              description:
                remaining.organization ||
                remaining.instructor ||
                "프리미엄 강의",
              imageUrl: remaining.imageUrl || "/placeholder.svg",
              linkUrl: `/lectures/${remaining.id}`,
              backgroundColor:
                [
                  "bg-blue-50",
                  "bg-purple-50",
                  "bg-orange-50",
                  "bg-green-50",
                  "bg-pink-50",
                ][allBanners.length] || "bg-blue-50",
            });
          } else {
            break;
          }
        }

        // 최소 1개는 있어야 함
        if (allBanners.length === 0) {
          // 기본 배너 (데이터가 없을 때)
          allBanners.push({
            id: 0,
            title: "소프트웨어 캠퍼스",
            description: "당신의 IT 꿈을 실현하세요",
            imageUrl: "/placeholder.svg",
            linkUrl: "/lectures",
            backgroundColor: "bg-blue-50",
          });
        }

        const finalBanners = allBanners.slice(0, 5); // 최대 5개
        console.log("최종 배너 개수:", finalBanners.length);
        console.log("배너 데이터:", finalBanners);

        // 각 배너의 imageUrl 확인
        finalBanners.forEach((banner, index) => {
          console.log(`배너 ${index + 1} - imageUrl:`, banner.imageUrl);
        });

        setAdBanners(finalBanners);
      } catch (error) {
        console.error("배너 데이터 로드 실패:", error);
        // 에러 시 기본 배너 표시
        setAdBanners([
          {
            id: 0,
            title: "소프트웨어 캠퍼스",
            description: "당신의 IT 꿈을 실현하세요",
            imageUrl: "/placeholder.svg",
            linkUrl: "/lectures",
            backgroundColor: "bg-blue-50",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLectures();
  }, []);

  // ========== 자동 전환: 3초마다 다음 배너로 이동 ==========
  useEffect(() => {
    if (adBanners.length <= 1) return; // 배너가 1개 이하면 자동 전환 불필요

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % adBanners.length);
    }, 3000); // 3초마다 전환

    return () => clearInterval(interval);
  }, [adBanners.length]);

  // ========== 이전 배너로 이동 ==========
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + adBanners.length) % adBanners.length);
  };

  // ========== 다음 배너로 이동 ==========
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % adBanners.length);
  };

  // ========== 특정 배너로 직접 이동 ==========
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // ========== 로딩 중 ==========
  if (isLoading) {
    return (
      <section className="relative w-full bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="relative overflow-hidden rounded-2xl h-64 md:h-80 lg:h-96 bg-muted animate-pulse" />
        </div>
      </section>
    );
  }

  // ========== 배너가 없을 때 ==========
  if (adBanners.length === 0) {
    return null;
  }

  return (
    // ========== 캐러셀 컨테이너 ==========
    <section className="relative w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ========== 배너 슬라이드 영역 ========== */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* ========== 배너 리스트 (transform으로 슬라이드 효과) ========== */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {adBanners.map((banner) => (
              <div key={banner.id} className="min-w-full relative">
                {/* ========== 배너 링크 영역 ========== */}
                <a
                  href={banner.linkUrl}
                  className={`block relative h-64 md:h-80 lg:h-96 ${banner.backgroundColor} 
                            rounded-2xl overflow-hidden group cursor-pointer`}
                >
                  {/* ========== 배너 이미지 ========== */}
                  <div className="relative w-full h-full">
                    <img
                      src={banner.imageUrl || "/placeholder.svg"}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // 이미지 로드 실패 시 placeholder로 대체
                        console.warn(`이미지 로드 실패: ${banner.imageUrl}`, e);
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                      onLoad={() => {
                        console.log(`이미지 로드 성공: ${banner.imageUrl}`);
                      }}
                    />
                    
                    {/* ========== 배너 텍스트 오버레이 ========== */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                                  flex items-end p-8"
                    >
                      <div className="text-white">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                          {banner.title}
                        </h3>
                        <p className="text-sm md:text-base lg:text-lg opacity-90">
                          {banner.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* ========== 좌측 화살표 버튼 ========== */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 
                     bg-white/80 hover:bg-white shadow-lg
                     hidden md:flex"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* ========== 우측 화살표 버튼 ========== */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 
                     bg-white/80 hover:bg-white shadow-lg
                     hidden md:flex"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* ========== 하단 인디케이터 점 (5개) ========== */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 
                        flex items-center gap-2"
          >
            {adBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300
                          ${
                            index === currentIndex
                              ? "bg-white w-8"
                              : "bg-white/50 hover:bg-white/80"
                          }`}
                aria-label={`배너 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
