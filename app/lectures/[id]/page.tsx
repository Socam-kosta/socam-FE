// ========== 강의 상세 페이지 ==========
// 역할: 모든 사용자
// 기능: 강의 정보 조회, 리뷰 작성/조회, 커리큘럼, 강사 소개

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star, Heart, Calendar, MapPin, Clock, User, CheckCircle2, Building2, CreditCard, GraduationCap, Briefcase, FileText, Users, Award, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

// ========== 백엔드 실제 필드 (DB 존재) ==========
const lectureDataFromBackend = {
  id: 1,
  title: 'React 완벽 마스터 - 기초부터 실전까지', // title (훈련과목명)
  teacher: '김철수', // teacher (강사명)
  category: '프론트엔드', // category
  target: '재직자', // target
  method: '온라인', // method (온라인/오프라인)
  startDate: '2025-03-01', // startDate
  endDate: '2025-04-30', // endDate
  classDetail: 'React의 기초부터 고급 기능까지 완벽하게 마스터하는 강의입니다. 실무에서 바로 활용 가능한 프로젝트 중심의 학습을 진행합니다. Hooks, Context API, Redux 등 상태관리부터 Next.js를 활용한 SSR/SSG까지 모든 내용을 다룹니다.', // classDetail (강의 설명)
  organization: 'ABC IT 교육원', // organization name (FK)
  rating: 4.9,
  reviewCount: 234,
  image: '/react-course.png',
}

// ========== 프론트엔드 전용 Mock 데이터 (백엔드 없음) ==========
const mockDataForUI = {
  location: '강남', // location (지역) - MOCK
  requiresCard: true, // requiresCard (내일배움카드 필요 여부) - MOCK
  ncsSubjects: ['웹 개발', '프론트엔드 프레임워크', 'UI/UX 구현'], // NCS 핵심과목 - MOCK
  tuition: 1200000, // 수강료 - MOCK
  supportAmount: 700000, // 지원금 - MOCK
  finalPrice: 500000, // 실 부담금 - MOCK
  schedule: '월~금 09:00-18:00', // 훈련 시간표 - MOCK
  ageRequirement: '제한없음', // 나이 제한 - MOCK
  educationRequirement: '고졸 이상', // 학력 요건 - MOCK
  applicationProcess: [ // 지원 절차 - MOCK
    { step: 1, name: '서류 접수', description: '이력서 및 자기소개서 제출' },
    { step: 2, name: '코딩 테스트', description: 'JavaScript 기초 테스트 (온라인)' },
    { step: 3, name: '면접', description: '1:1 개별 면접 (20분)' },
    { step: 4, name: '최종 합격', description: '합격자 발표 및 등록 안내' },
  ],
  recruitmentInfo: { // 채용 연계 정보 - MOCK
    talentRecommendation: true, // 인재 추천
    internProgram: true, // 인턴 전형
    employmentRate: 85, // 취업률
  },
  curriculum: [ // 커리큘럼 - MOCK
    { week: 1, title: 'JavaScript ES6+ 완벽 정리', topics: ['let/const', 'Arrow Function', 'Promise', 'async/await'] },
    { week: 2, title: 'React 기초', topics: ['JSX', 'Components', 'Props', 'State'] },
    { week: 3, title: 'React Hooks', topics: ['useState', 'useEffect', 'useContext', 'Custom Hooks'] },
    { week: 4, title: '상태 관리', topics: ['Context API', 'Redux Toolkit', 'Zustand'] },
    { week: 5, title: 'React Router & API 연동', topics: ['React Router v6', 'Axios', 'Fetch API'] },
    { week: 6, title: 'Next.js 입문', topics: ['SSR', 'SSG', 'API Routes', 'Deployment'] },
  ],
  instructorBio: { // 강사 소개 - MOCK
    name: '김철수',
    career: '현) 네이버 Frontend Engineer / 전) 카카오 Senior Developer',
    experience: '10년',
    achievements: ['React Korea 컨퍼런스 스피커', 'Best Educator Award 2024', 'React 오픈소스 Contributor'],
    image: '/instructor-kim.png',
  },
  relatedLectures: [ // 유사 강의 추천 - MOCK
    { id: 2, title: 'Vue.js 완벽 가이드', instructor: '이영희', rating: 4.8, image: '/vue-course.png' },
    { id: 3, title: 'TypeScript with React', instructor: '박민수', rating: 4.7, image: '/ts-react.png' },
  ],
}

// ========== 리뷰 데이터 (백엔드에서 가져온 것으로 가정) ==========
const reviews = [
  {
    id: 1,
    lectureName: 'React 완벽 마스터', // lecture_name
    instructorName: '김철수', // instructor_name
    trainingSubject: '프론트엔드 개발', // training_subject
    author: '학생1',
    rating: 5,
    content: '정말 좋은 강의입니다. 실무에서 바로 적용할 수 있는 내용들이 많았고, 강사님의 설명이 매우 명확했습니다. 특히 Hooks 부분이 이해가 잘 되었어요!',
    date: '2025-02-15',
  },
  {
    id: 2,
    lectureName: 'React 완벽 마스터',
    instructorName: '김철수',
    trainingSubject: '프론트엔드 개발',
    author: '학생2',
    rating: 4,
    content: '강사님의 설명이 명확하고 이해하기 쉬웠습니다. 다만 진도가 조금 빠른 감이 있어서 복습이 필수입니다.',
    date: '2025-02-10',
  },
  {
    id: 3,
    lectureName: 'React 완벽 마스터',
    instructorName: '김철수',
    trainingSubject: '프론트엔드 개발',
    author: '학생3',
    rating: 5,
    content: '취업 준비하면서 들었는데 포트폴리오 만들기에 정말 도움이 많이 되었습니다. 강력 추천!',
    date: '2025-02-05',
  },
]

export default function LectureDetailPage() {
  const params = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState<'intro' | 'ncs' | 'eligibility' | 'curriculum' | 'reviews' | 'instructor'>('intro')
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    lectureName: lectureDataFromBackend.title,
    instructorName: lectureDataFromBackend.teacher,
    trainingSubject: lectureDataFromBackend.category,
    content: '',
  })

  // ========== 리뷰 작성 처리 ==========
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Review submitted:', reviewForm)
    alert('리뷰가 작성되었습니다. 관리자 검토 후 게시됩니다.')
    setReviewForm({ ...reviewForm, content: '' })
  }

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen">
        {/* ========== Hero Section (강의명, 기관명, 평점, 태그) ========== */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">{lectureDataFromBackend.title}</h1>
                <Link href="/organizations/1" className="text-lg text-primary hover:underline mb-4 inline-block">
                  <Building2 className="inline h-5 w-5 mr-1" />
                  {lectureDataFromBackend.organization}
                </Link>
                
                {/* ========== 별점 및 리뷰 수 ========== */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= lectureDataFromBackend.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-lg">{lectureDataFromBackend.rating}</span>
                    <span className="text-muted-foreground">({lectureDataFromBackend.reviewCount}개 리뷰)</span>
                  </div>
                </div>

                {/* ========== 태그 배지 ========== */}
                <div className="flex flex-wrap gap-2">
                  <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                    {lectureDataFromBackend.category}
                  </div>
                  <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                    {lectureDataFromBackend.target}
                  </div>
                  <div className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
                    {lectureDataFromBackend.method}
                  </div>
                </div>
              </div>

              {/* ========== 찜하기 버튼 ========== */}
              <Button
                variant={isLiked ? 'default' : 'outline'}
                size="lg"
                onClick={() => setIsLiked(!isLiked)}
                className="ml-4"
              >
                <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? '찜 완료' : '찜하기'}
              </Button>
            </div>
          </div>
        </div>

        {/* ========== Main Banner Image ========== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8">
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden shadow-2xl">
            <img
              src={lectureDataFromBackend.image || "/placeholder.svg?height=600&width=1400"}
              alt={lectureDataFromBackend.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* ========== Left Section + Right Sidebar ========== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ========== 좌측: 탭 콘텐츠 영역 ========== */}
            <div className="lg:col-span-2">
              {/* ========== 탭 네비게이션 ========== */}
              <div className="border-b border-border mb-6 sticky top-0 bg-background z-10">
                <div className="flex gap-4 overflow-x-auto">
                  {[
                    { id: 'intro', label: '강의소개' },
                    { id: 'ncs', label: 'NCS' },
                    { id: 'eligibility', label: '지원정보' },
                    { id: 'curriculum', label: '커리큘럼' },
                    { id: 'reviews', label: `후기 (${lectureDataFromBackend.reviewCount})` },
                    { id: 'instructor', label: '강사소개' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setActiveTab(tab.id as any)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ========== 탭: 강의 소개 ========== */}
              {activeTab === 'intro' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>강의 소개</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {lectureDataFromBackend.classDetail}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>강의 특징</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>프로젝트 중심의 실습 위주 학습</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>현직 개발자의 실무 경험 공유</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>소규모 클래스로 집중 케어</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>취업 연계 및 포트폴리오 지원</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>수강 대상</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• 프론트엔드 개발자로 취업을 준비하는 분</li>
                        <li>• React를 체계적으로 배우고 싶은 분</li>
                        <li>• 현업에서 React를 더 깊이 이해하고 싶은 재직자</li>
                        <li>• 포트폴리오 프로젝트를 완성하고 싶은 분</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========== 탭: NCS 정보 ========== */}
              {activeTab === 'ncs' && (
                <Card>
                  <CardHeader>
                    <CardTitle>NCS 훈련 핵심 과목</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockDataForUI.ncsSubjects.map((subject, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">{index + 1}</span>
                          </div>
                          <span className="font-medium">{subject}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                      * NCS(National Competency Standards): 국가직무능력표준으로, 
                      산업현장에서 직무를 수행하기 위해 요구되는 지식, 기술, 태도 등의 내용을 
                      국가가 산업부문별·수준별로 체계화한 것입니다.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* ========== 탭: 지원 정보 ========== */}
              {activeTab === 'eligibility' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>지원 자격</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">학력 요건</p>
                          <p className="text-sm text-muted-foreground">{mockDataForUI.educationRequirement}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">나이 제한</p>
                          <p className="text-sm text-muted-foreground">{mockDataForUI.ageRequirement}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">내일배움카드</p>
                          <p className="text-sm text-muted-foreground">
                            {mockDataForUI.requiresCard ? '필수 (HRD-Net에서 발급)' : '불필요'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>지원 절차</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockDataForUI.applicationProcess.map((step, index) => (
                          <div key={step.step} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                {step.step}
                              </div>
                              {index < mockDataForUI.applicationProcess.length - 1 && (
                                <div className="w-0.5 h-12 bg-border my-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <p className="font-semibold mb-1">{step.name}</p>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========== 탭: 커리큘럼 ========== */}
              {activeTab === 'curriculum' && (
                <Card>
                  <CardHeader>
                    <CardTitle>커리큘럼 ({mockDataForUI.curriculum.length}주)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockDataForUI.curriculum.map((week) => (
                        <div key={week.week} className="border border-border rounded-lg overflow-hidden">
                          <button
                            className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors"
                            onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-primary">Week {week.week}</span>
                              <span className="font-medium">{week.title}</span>
                            </div>
                            {expandedWeek === week.week ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                          {expandedWeek === week.week && (
                            <div className="p-4 bg-background">
                              <ul className="space-y-2">
                                {week.topics.map((topic, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ========== 탭: 후기 ========== */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* ========== 리뷰 작성 폼 ========== */}
                  <Card>
                    <CardHeader>
                      <CardTitle>리뷰 작성</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label>강의명</Label>
                            <p className="text-muted-foreground">{reviewForm.lectureName}</p>
                          </div>
                          <div>
                            <Label>강사명</Label>
                            <p className="text-muted-foreground">{reviewForm.instructorName}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>훈련과목</Label>
                            <p className="text-muted-foreground">{reviewForm.trainingSubject}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">별점</Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              >
                                <Star
                                  className={`h-7 w-7 cursor-pointer transition-colors ${
                                    star <= reviewForm.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 hover:text-yellow-200'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="review-content">느낀점</Label>
                          <Textarea
                            id="review-content"
                            placeholder="강의에 대한 솔직한 후기를 남겨주세요..."
                            value={reviewForm.content}
                            onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                            rows={5}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full">리뷰 작성</Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* ========== 리뷰 목록 ========== */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">수강생 리뷰</h3>
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-lg">{review.author}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">{review.rating}.0</span>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="mb-3 text-sm space-y-1">
                            <p><span className="text-muted-foreground">강의:</span> {review.lectureName}</p>
                            <p><span className="text-muted-foreground">강사:</span> {review.instructorName}</p>
                            <p><span className="text-muted-foreground">훈련과목:</span> {review.trainingSubject}</p>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{review.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ========== 탭: 강사 소개 ========== */}
              {activeTab === 'instructor' && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="h-24 w-24 rounded-full bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={mockDataForUI.instructorBio.image || "/placeholder.svg?height=96&width=96"}
                          alt={mockDataForUI.instructorBio.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{mockDataForUI.instructorBio.name}</h2>
                        <p className="text-muted-foreground mb-2">{mockDataForUI.instructorBio.career}</p>
                        <p className="text-sm text-primary font-medium">경력: {mockDataForUI.instructorBio.experience}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          주요 경력 및 수상
                        </h3>
                        <ul className="space-y-2">
                          {mockDataForUI.instructorBio.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* ========== 우측: 고정 사이드바 ========== */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                {/* ========== 수강료 정보 ========== */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">수강료 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">정가</span>
                      <span className="line-through text-muted-foreground">
                        {mockDataForUI.tuition.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">훈련지원금</span>
                      <span className="text-red-600 font-semibold">
                        -{mockDataForUI.supportAmount.toLocaleString()}원
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-semibold">실 부담금</span>
                      <span className="text-2xl font-bold text-primary">
                        {mockDataForUI.finalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* ========== 훈련 일정 정보 ========== */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">훈련 일정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">기간</p>
                        <p className="font-medium">{lectureDataFromBackend.startDate} ~ {lectureDataFromBackend.endDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">시간</p>
                        <p className="font-medium">{mockDataForUI.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">장소</p>
                        <p className="font-medium">
                          {lectureDataFromBackend.method === '온라인' ? '온라인' : mockDataForUI.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ========== 지원 자격 요약 ========== */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">지원 자격</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{mockDataForUI.requiresCard ? '내일배움카드 필수' : '내일배움카드 불필요'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>나이: {mockDataForUI.ageRequirement}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>학력: {mockDataForUI.educationRequirement}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* ========== 채용 연계 정보 ========== */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">채용 연계</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {mockDataForUI.recruitmentInfo.talentRecommendation && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-600" />
                        <span>인재 추천</span>
                      </div>
                    )}
                    {mockDataForUI.recruitmentInfo.internProgram && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span>인턴 전형 지원</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-semibold">취업률: {mockDataForUI.recruitmentInfo.employmentRate}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* ========== 신청하기 버튼 (큰 버튼) ========== */}
                <Button size="lg" className="w-full text-lg py-6">
                  수강 신청하기
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  문의하기
                </Button>
              </div>
            </div>
          </div>

          {/* ========== 유사 강의 추천 ========== */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">유사한 강의</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDataForUI.relatedLectures.map((lecture) => (
                <Link key={lecture.id} href={`/lectures/${lecture.id}`}>
                  <Card className="group overflow-hidden hover:border-primary transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={lecture.image || "/placeholder.svg"}
                        alt={lecture.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold line-clamp-1">{lecture.title}</h3>
                      <p className="mb-2 text-sm text-muted-foreground">{lecture.instructor}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{lecture.rating}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
