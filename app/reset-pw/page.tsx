'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { resetPassword } from '@/lib/api/user-reset'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
    const router = useRouter()
    const params = useSearchParams()
    const token = params.get('token') || ''

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    if (!token) {
        return <p className="text-center mt-10">유효하지 않은 접근입니다.</p>
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (!newPassword || !confirmPassword) {
            setError('모든 필드를 입력해주세요.')
            return
        }

        try {
            setLoading(true)
            await resetPassword(token, newPassword, confirmPassword)
            setMessage('비밀번호가 성공적으로 변경되었습니다.')
            setTimeout(() => router.push('/login/student'), 1500)
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
                    <h1 className="text-xl font-bold mb-6">비밀번호 재설정</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>새 비밀번호</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>새 비밀번호 확인</Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {message && <p className="text-green-600 text-sm">{message}</p>}
                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? '처리 중...' : '비밀번호 변경'}
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}
