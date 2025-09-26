'use client'
import React, { FC, useState } from 'react'
import { useTranslations } from 'next-intl'
import { User } from '@/types/usersTypes'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    User as UserIcon, 
    Phone, 
    CreditCard, 
    Shield, 
    Calendar,
    Hash,
    CheckCircle,
    XCircle
} from 'lucide-react'

interface UserProfileProps {
    user: User
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
    const [imageError, setImageError] = useState(false)
    const tDetail = useTranslations('Users.DetailPage')

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="overflow-hidden shadow-lg">
                {/* Header with theme-based background */}
                <CardHeader className="relative text-center pb-4 bg-card text-card-foreground">
                    <div className="absolute inset-0 bg-card/90"></div>
                    <div className="relative z-10">
                        {/* Profile Image with enhanced styling */}
                        <div className="flex justify-center mb-3">
                            <div className="relative">
                                {user.image && !imageError ? (
                                    <div className="relative">
                                        <Image 
                                            src={typeof user.image === 'string' && user.image.startsWith('http') ? user.image : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://skud-beckend.test'}/${user.image}`} 
                                            alt={`${user.first_name} ${user.last_name}`}
                                            width={120}
                                            height={120}
                                            priority
                                            className="w-32 h-32 rounded-full object-cover border-4 border-primary-foreground/20 shadow-2xl transition-transform duration-300 hover:scale-105"
                                            onError={() => {
                                                console.error('Image load error for:', user.image);
                                                setImageError(true);
                                            }}
                                        />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full border-4 border-primary-foreground flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-accent-foreground" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border-4 border-primary-foreground/20 shadow-2xl">
                                        <UserIcon className="w-16 h-16 text-primary-foreground/80" />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <CardTitle className="text-2xl font-bold mb-2 drop-shadow-sm">
                            {user.first_name} {user.last_name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {user.includes?.roles && user.includes.roles.length > 0 ? (
                                user.includes.roles.map((role) => (
                                    <Badge 
                                        key={role.id}
                                        variant="secondary" 
                                        className="bg-accent/20 backdrop-blur-sm text-accent-foreground border-accent/30 hover:bg-accent/30 transition-colors duration-200"
                                    >
                                        <Shield className="w-4 h-4 mr-2" />
                                        {role.name}
                                    </Badge>
                                ))
                            ) : (
                                <Badge 
                                    variant="secondary" 
                                    className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30 transition-colors duration-200"
                                >
                                    <Shield className="w-4 h-4 mr-2" />
                                    No roles assigned
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-3">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <Badge 
                            variant={user.status ? "default" : "destructive"} 
                            className="px-4 py-2 text-sm font-medium transition-colors duration-200"
                        >
                            {user.status ? (
                                <CheckCircle className="w-4 h-4 mr-2" />
                            ) : (
                                <XCircle className="w-4 h-4 mr-2" />
                            )}
                            {user.status ? tDetail('labels.active') : tDetail('labels.inactive')}
                        </Badge>
                    </div>

                    {/* User Information Grid */}
                    <div className="grid gap-2">
                        {/* ID */}
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Hash className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {tDetail('labels.id')}
                                </label>
                                <p className="text-sm font-medium text-foreground mt-1">
                                    #{user.id}
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-accent/50 rounded-lg flex items-center justify-center">
                                <Phone className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {tDetail('labels.phone')}
                                </label>
                                <p className="text-sm font-medium text-foreground mt-1">
                                    {user.phone || (
                                        <span className="text-muted-foreground italic">Not provided</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Card Number */}
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {tDetail('labels.cardNumber')}
                                </label>
                                <p className="text-sm font-medium text-foreground mt-1">
                                    {user.card_number || (
                                        <span className="text-muted-foreground italic">Not assigned</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Created Date */}
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-secondary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Member Since
                                </label>
                                <p className="text-sm font-medium text-foreground mt-1">
                                    {formatDate(user.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserProfile
