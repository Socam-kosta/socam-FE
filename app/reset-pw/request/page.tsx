'use client'

import { useState } from 'react'
import { requestPasswordReset } from '@/lib/api/user-reset'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function PasswordResetRequestPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('')
        setError('')

        if (!email) {
            setError('이메일을 입력해주세요.')
            return
        }

        try {
            setLoading(true)
            await requestPasswordReset(email)
            setMessage('비밀번호 재설정 링크가 이메일로 발송되었습니다.')
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
                <div className="w-full max-w-md p-6 border rounded-lg shadow">
                    <h1 className="text-xl font-bold mb-6">비밀번호 재설정 요청</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">가입한 이메일을 적어주세요</Label>
                            <Input
                                type="email"
                                placeholder="email@example.com"
                                className="h-12 text-base px-4"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {message && <p className="text-green-600 text-sm">{message}</p>}
                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? '전송 중...' : '비밀번호 재설정 메일 보내기'}
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}
