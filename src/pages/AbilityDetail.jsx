import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAbilityBySlug } from '../data/abilities'
import ConversationGallery from '../components/ConversationGallery/ConversationGallery'
import BlurText from '../components/BlurText/BlurText'
import ScrollReveal from '../components/ScrollReveal/ScrollReveal'
import './AbilityDetail.css'

const AbilityDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [ability, setAbility] = useState(null)
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get ability data
    const abilityData = getAbilityBySlug(slug)
    
    if (!abilityData) {
      // Ability not found, redirect to superpowers page
      navigate('/superpowers', { replace: true })
      return
    }

    setAbility(abilityData)

    // Dynamically import conversation data
    const loadConversations = async () => {
      try {
        const conversationModule = await import(`../data/conversations/${abilityData.conversationsFile}.js`)
        setConversations(conversationModule.conversations || [])
      } catch (error) {
        console.error('Error loading conversations:', error)
        setConversations([])
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [slug, navigate])

  if (loading || !ability) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">טוען...</div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen">
      {/* Hero Section */}
      <section className="ability-detail-hero bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
              containerClassName="text-5xl md:text-7xl font-bold mb-6 leading-tight theme-gradient-text"
            >
              {ability.title}
            </ScrollReveal>
            <BlurText
              text={ability.description}
              delay={100}
              animateBy="words"
              direction="bottom"
              className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* Conversation Gallery Section */}
      <section className="ability-detail-conversations py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={3}
              blurStrength={8}
              containerClassName="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
            >
              דוגמאות שימוש
            </ScrollReveal>
            <BlurText
              text={`ראה איך דונה עוזר לך עם ${ability.title}`}
              delay={80}
              animateBy="words"
              direction="top"
              className="text-base md:text-lg text-gray-600"
            />
          </div>
          
          {conversations.length > 0 ? (
            <ConversationGallery conversations={conversations} />
          ) : (
            <div className="text-center text-gray-500 py-12">
              אין דוגמאות זמינות כרגע
            </div>
          )}
        </div>
      </section>

      {/* Back Button Section */}
      <section className="ability-detail-cta py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => navigate('/superpowers')}
            className="theme-gradient-bg text-white text-xl font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            חזור לכל היכולות
          </button>
        </div>
      </section>
    </div>
  )
}

export default AbilityDetail

