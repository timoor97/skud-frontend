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
        <div className="w-full">
            <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                {/* Header with enhanced gradient background */}
                <CardHeader className="relative text-center pb-6 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                    <div className="relative z-10">
                        {/* Profile Image with enhanced styling */}
                        <div className="flex justify-center mb-4">
                            <div className="relative group">
                                {user.image && !imageError ? (
                                    <div className="relative">
                                        <Image 
                                            src={typeof user.image === 'string' && user.image.startsWith('http') ? user.image : `${process.env.NEXT_PUBLIC_BASE_URL}/${user.image}`} 
                                            alt={`${user.first_name} ${user.last_name}`}
                                            width={120}
                                            height={120}
                                            priority
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary/20 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl"
                                            onError={() => {
                                                console.error('Image load error for:', user.image);
                                                setImageError(true);
                                            }}
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full border-2 border-background flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm flex items-center justify-center border-4 border-primary/20 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                                        <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-primary/80" />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <CardTitle className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
                            {user.first_name} {user.last_name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {user.includes?.roles && user.includes.roles.length > 0 ? (
                                user.includes.roles.map((role) => (
                                    <Badge 
                                        key={role.id}
                                        variant="secondary" 
                                        className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200 text-xs sm:text-sm"
                                    >
                                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        {role.name}
                                    </Badge>
                                ))
                            ) : (
                                <Badge 
                                    variant="secondary" 
                                    className="bg-muted text-muted-foreground border-muted-foreground/20 text-xs sm:text-sm"
                                >
                                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    No roles assigned
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 space-y-4">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <Badge 
                            variant={user.status ? "default" : "destructive"} 
                            className="px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200"
                        >
                            {user.status ? (
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            ) : (
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            )}
                            {user.status ? tDetail('labels.active') : tDetail('labels.inactive')}
                        </Badge>
                    </div>

                    {/* User Information Grid */}
                    <div className="space-y-3">
                        {/* ID */}
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/20 transition-all duration-200 border border-border/50">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {tDetail('labels.id')}
                                </label>
                                <p className="text-sm font-medium text-foreground mt-0.5">
                                    #{user.id}
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/20 transition-all duration-200 border border-border/50">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {tDetail('labels.phone')}
                                </label>
                                <p className="text-sm font-medium text-foreground mt-0.5">
                                    {user.phone || (
                                        <span className="text-muted-foreground italic">Not provided</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Card Number */}
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/20 transition-all duration-200 border border-border/50">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {tDetail('labels.cardNumber')}
                                </label>
                                <p className="text-sm font-medium text-foreground mt-0.5">
                                    {user.card_number || (
                                        <span className="text-muted-foreground italic">Not assigned</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Created Date */}
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/20 transition-all duration-200 border border-border/50">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-secondary/30 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Member Since
                                </label>
                                <p className="text-sm font-medium text-foreground mt-0.5">
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
