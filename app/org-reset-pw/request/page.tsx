'use client'

import { useState } from "react"
import { requestOrgPasswordReset } from "@/lib/api/org-reset"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function OrgPasswordResetRequestPage() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage("")
        setError("")

        try {
            setLoading(true)
            await requestOrgPasswordReset(email)
            setMessage("비밀번호 재설정 링크가 이메일로 발송되었습니다.")
        } catch (err) {
            setError(err instanceof Error ? err.message : "오류 발생")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <main className="flex items-center justify-center py-12">
                <div className="w-full max-w-md p-6 border rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-6">기관 비밀번호 재설정 요청</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label>기관 이메일</Label>
                            <Input
                                type="email"
                                className="h-12"
                                placeholder="org@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {message && <p className="text-green-600 text-sm">{message}</p>}
                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <Button className="w-full h-12" disabled={loading}>
                            {loading ? "전송 중..." : "재설정 메일 보내기"}
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}
