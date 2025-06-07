"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import React from "react";
import { 
  Check, 
  Shield, 
  Globe, 
  Zap, 
  BarChart3, 
  Smartphone, 
  Star, 
  CreditCard, 
  Users, 
  Brain, 
  Code, 
  Layers, 
  Palette, 
  Play, 
  Settings, 
  FileText, 
  BookOpen 
} from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({
    developers: 0,
    frameworks: 0,
    features: 0,
    satisfaction: 0
  });

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  // Animate stats numbers
  useEffect(() => {
    if (isStatsInView) {
      const animateValue = (start: number, end: number, duration: number, setter: (value: number) => void) => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          setter(Math.floor(progress * (end - start) + start));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      };

      animateValue(0, 10000, 2000, (value) => setStats(prev => ({ ...prev, developers: value })));
      animateValue(0, 2, 2000, (value) => setStats(prev => ({ ...prev, frameworks: value })));
      animateValue(0, 50, 2500, (value) => setStats(prev => ({ ...prev, features: value })));
      animateValue(0, 99, 2000, (value) => setStats(prev => ({ ...prev, satisfaction: value })));
    }
  }, [isStatsInView]);

  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 dark:bg-pink-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                虽然是{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  小船
                </span>
                ，也能载你远航
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                现代化全栈 SaaS 开发平台，支持国内外双市场。
                一次购买，终身使用，快速构建你的商业项目。
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-full transition-all duration-300 hover:scale-105"
                >
                  立即购买
                  </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-4 text-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all duration-300 hover:scale-105"
                >
                  查看演示
                  </Button>
              </motion.div>

              <motion.div 
                className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>一次购买终身使用</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>早鸟价限时优惠</span>
                </div>
              </motion.div>
            </motion.div>
              </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                全栈 SaaS 开发平台
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-200 max-w-2xl mx-auto">
                从双框架支持到 AI 集成，从全球化到本土化，TinyShip 为你的商业项目提供完整的现代化技术解决方案。
              </p>
            </motion.div>

            <BentoGrid className="max-w-7xl mx-auto auto-rows-[14rem] grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <BentoCard
                    name={feature.title}
                    description={feature.description}
                    Icon={feature.icon}
                    className={`${feature.className} group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 h-full`}
                    background={
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-5 dark:opacity-15 group-hover:opacity-10 dark:group-hover:opacity-25 transition-opacity duration-300 rounded-xl" />
                    }
                    cta="了解更多"
                    href={`/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                </motion.div>
              ))}
            </BentoGrid>

            {/* 技术栈展示 */}
            <motion.div 
              className="mt-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-8">基于现代化技术栈构建</h3>
              <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">Next.js / Nuxt.js</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">TailwindCSS v4</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">Better-Auth</span>
              </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">Vercel AI SDK</span>
            </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">TypeScript + Zod</span>
                  </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">shadcn/ui + Magic UI</span>
                  </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">Drizzle ORM + PostgreSQL</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Application Features Details */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                核心应用特性
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                从国内外双体系支持到 AI 集成，TinyShip 为你的商业项目提供完整的技术解决方案。
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* 左侧：功能列表 */}
                <div className="lg:col-span-2 space-y-4">
                  {applicationFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        activeFeature === index
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 shadow-lg'
                          : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'
                      }`}
                      onClick={() => setActiveFeature(index)}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                            activeFeature === index
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                              : 'bg-gradient-to-br from-slate-400 to-slate-500'
                          }`}>
                            {index + 1}
                          </div>
                          <h3 className={`text-lg font-bold ${
                            activeFeature === index ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-white'
                          }`}>
                            {feature.title}
                          </h3>
                        </div>
                        <p className={`text-sm leading-relaxed pl-13 ${
                          activeFeature === index ? 'text-blue-700 dark:text-blue-200' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                          {feature.subtitle}
                        </p>
                        {/* 显示当前选中项的要点 */}
                        {activeFeature === index && (
                          <motion.div 
                            className="pl-13 space-y-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                          >
                            {feature.highlights.slice(0, 3).map((highlight, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="text-blue-700 dark:text-blue-200 text-xs font-medium">{highlight}</span>
                      </div>
                            ))}
                          </motion.div>
                        )}
                    </div>
                    </motion.div>
                  ))}
                  </div>

                {/* 右侧：图片和简要描述 */}
                <div className="lg:col-span-3">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* 图片占位 */}
                    <div className="aspect-[16/10] bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-slate-100 dark:from-blue-900/30 dark:to-slate-700 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          {React.createElement(applicationFeatures[activeFeature].icon, {
                            className: "h-20 w-20 text-blue-600 dark:text-blue-400 mx-auto"
                          })}
                          <div className="text-slate-600 dark:text-slate-300 font-medium text-lg">{applicationFeatures[activeFeature].imageTitle}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">功能演示界面</div>
                  </div>
                  </div>
                  </div>

                    {/* 简要描述 */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {applicationFeatures[activeFeature].description}
                      </p>
                  </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* 技术优势提示 */}
            <motion.div 
              className="mt-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-2000"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse animation-delay-4000"></div>
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">企业级技术架构，生产环境验证</span>
              </div>
            </motion.div>
        </div>
      </section>

        {/* Roadmap Section */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                产品路线图
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                持续迭代，不断创新。我们致力于为开发者提供更强大、更灵活的 SaaS 开发解决方案。
              </p>
            </motion.div>

            {/* 横向滚动容器 */}
            <div className="relative">
              <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide">
                {roadmapItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-80 snap-start"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* 时间线节点 */}
                    <div className="flex items-center mb-4">
                      <div className={`w-4 h-4 rounded-full border-4 ${
                        item.status === 'completed' 
                          ? 'bg-green-500 border-green-200' 
                          : item.status === 'in-progress'
                          ? 'bg-blue-500 border-blue-200'
                          : 'bg-slate-300 dark:bg-slate-600 border-slate-200 dark:border-slate-500'
                      } shadow-lg mr-3`}>
                        {item.status === 'completed' && (
                          <Check className="w-2 h-2 text-white absolute -top-1 -left-1" />
                        )}
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800"></div>
                    </div>

                    {/* 内容卡片 */}
                    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-80 ${
                      item.status === 'completed' 
                        ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20' 
                        : item.status === 'in-progress'
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                          item.status === 'completed' 
                            ? 'bg-gradient-to-br from-green-500 to-green-600' 
                            : item.status === 'in-progress'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                            : 'bg-gradient-to-br from-slate-400 to-slate-500'
                        }`}>
                          <item.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">{item.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'completed' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                                : item.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                              {item.statusText}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.timeline}</span>
                          </div>
            </div>
          </div>
          
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-sm line-clamp-3">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {item.features.map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 底部提示 */}
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full border border-blue-200 dark:border-blue-700">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-2000"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-4000"></div>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">持续更新中，敬请期待更多功能...</span>
              </div>
            </motion.div>
        </div>
      </section>

        {/* Stats Section */}
        <section className="py-24 bg-white dark:bg-slate-900" ref={statsRef}>
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                值得信赖的选择
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                  {stats.developers.toLocaleString()}+
                </div>
                <div className="text-slate-600 dark:text-slate-400">用户选择</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                  {stats.frameworks}
                </div>
                <div className="text-slate-600 dark:text-slate-400">前端框架支持</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                  {stats.features}+
                </div>
                <div className="text-slate-600 dark:text-slate-400">内置功能模块</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                  {stats.satisfaction}%
              </div>
                <div className="text-slate-600 dark:text-slate-400">用户满意度</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-slate-50 dark:bg-slate-800">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                用户真实反馈
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-slate-700 p-8 rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.author[0]}
                  </div>
                  <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* Pricing */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                早鸟价限时优惠
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                一次购买，终身使用。早鸟用户享受超值优惠价格。
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">早鸟价</h3>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    ¥299
                  </div>
                  <div className="text-lg text-slate-500 dark:text-slate-400 line-through mb-2">原价 ¥599</div>
                  <p className="text-slate-600 dark:text-slate-300">限时优惠，仅限前 100 名用户</p>
            </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">完整源代码访问</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">所有功能模块</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">终身免费更新</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">技术支持群</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">商业使用授权</span>
                  </li>
                </ul>
                <Button 
                  className="w-full py-3 rounded-full transition-all duration-300 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900"
                >
                  立即抢购
                </Button>
              </motion.div>

              <motion.div
                className="p-8 rounded-2xl border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    推荐选择
                  </span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">正式版</h3>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    ¥599
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">早鸟期结束后恢复原价</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">完整源代码访问</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">所有功能模块</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">终身免费更新</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">优先技术支持</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">商业使用授权</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">1对1技术咨询</span>
                  </li>
                </ul>
                <Button 
                  className="w-full py-3 rounded-full transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  预约购买
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-800 dark:via-blue-800 dark:to-slate-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-repeat opacity-10"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                准备好开始你的远航了吗？
              </h2>
              <p className="text-xl text-slate-300 dark:text-slate-400 mb-8">
                加入数千名用户的行列，用 TinyShip 快速构建你的下一个商业项目。
                虽然是小船，但足以载你驶向成功的彼岸。早鸟价仅限前 100 名用户！
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg bg-white text-slate-900 hover:bg-slate-100 rounded-full transition-all duration-300 hover:scale-105"
                >
                  立即抢购 ¥299
                  </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-105"
                >
                  查看演示
                  </Button>
              </div>
            </motion.div>
        </div>
      </section>
      
      {/* Footer */}
        <footer className="py-12 bg-slate-900 dark:bg-slate-950 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                  T
                </div>
                <span className="text-xl font-bold">TinyShip</span>
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="text-slate-400 dark:text-slate-500 text-center md:text-left">
                  © {new Date().getFullYear()} TinyShip. All rights reserved.
                </div>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                    <span className="text-xs">G</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                    <span className="text-xs">T</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                    <span className="text-xs">D</span>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

// Data
const features = [
  {
    icon: Layers,
    title: "双框架支持",
    description: "灵活选择 Next.js 或 Nuxt.js，React 和 Vue 开发者都能找到熟悉的技术栈，同时享受相同的强大后端能力。",
    className: "col-span-1 row-span-1"
  },
  {
    icon: Shield,
    title: "全面身份认证",
    description: "基于 Better-Auth 的企业级认证系统，支持邮箱/手机/OAuth 登录，2FA 多因子认证，会话管理等完整认证体系。",
    className: "col-span-1 row-span-1"
  },
  {
    icon: Globe,
    title: "全球化 + 本土化",
    description: "既支持国际市场的 Stripe、OAuth 登录，也深度适配中国本土市场的微信登录、微信支付，双市场无缝覆盖。",
    className: "col-span-2 row-span-1"
  },
  {
    icon: Zap,
    title: "现代化技术栈",
    description: "采用最新技术：TailwindCSS v4、shadcn/ui、Magic UI、TypeScript、Zod 类型安全验证，开发体验极佳。",
    className: "col-span-1 row-span-1"
  },
  {
    icon: BarChart3,
    title: "Monorepo 架构",
    description: "简化的 Monorepo 结构，libs 抽象接口设计，轻松扩展各种云服务商，代码复用率高，架构清晰。",
    className: "col-span-2 row-span-1"
  },
  {
    icon: Smartphone,
    title: "通信服务集成",
    description: "多渠道通信支持：邮件服务（Resend/SendGrid）、短信服务（阿里云/Twilio），全球化通信无障碍。",
    className: "col-span-1 row-span-1"
  },
  {
    icon: Brain,
    title: "AI 开发就绪",
    description: "集成 Vercel AI SDK，支持多 AI 提供商，内置 Cursor 开发规则，AI 辅助开发，智能化构建应用。",
    className: "col-span-1 row-span-1"
  },
  {
    icon: Code,
    title: "无厂商锁定",
    description: "开放架构设计，可自由选择云服务商、数据库、支付提供商等，避免技术绑定，保持最大灵活性。",
    className: "col-span-1 row-span-1"
  }
];

const roadmapItems = [
  {
    title: "核心平台搭建",
    description: "完成 TinyShip 核心平台的开发，包括双框架支持、身份认证、支付集成、国际化等基础功能模块。",
    timeline: "2025 Q2",
    status: "completed" as const,
    statusText: "已完成",
    icon: Check,
    features: ["双框架支持", "身份认证系统", "支付集成", "国际化支持", "AI 开发就绪", "内置 Admin Panel"]
  },
  {
    title: "第三方服务扩展",
    description: "大幅扩展第三方服务支持，覆盖更多云服务商和 SaaS 工具。通过统一的接口设计，让你轻松切换和集成各种服务提供商。",
    timeline: "2025 Q3",
    status: "in-progress" as const,
    statusText: "开发中",
    icon: Settings,
    features: ["更多支付网关", "云存储服务", "更多短信服务商"]
  },
  {
    title: "博客/文档系统",
    description: "内置完整的博客和文档管理系统，支持 Markdown 编辑、SEO 优化、评论系统等功能。让你的 SaaS 产品拥有完整的内容营销能力。",
    timeline: "2025 Q4",
    status: "planned" as const,
    statusText: "计划中",
    icon: BookOpen,
    features: ["博客系统", "文档系统", "知识库搜索"]
  },
  {
    title: "主题系统升级",
    description: "推出全新的主题系统，提供多种精美的 UI 主题和布局选择。支持深度定制和品牌化，让你的应用拥有独特的视觉体验。",
    timeline: "2026 Q1",
    status: "planned" as const,
    statusText: "计划中",
    icon: Palette,
    features: ["多套 UI 主题", "深色模式支持", "组件库扩展"]
  },
  {
    title: "视频教程体系",
    description: "制作完整的视频教程系列，从基础使用到高级定制，帮助开发者快速掌握 TinyShip 的各项功能和最佳实践。",
    timeline: "2026 Q2",
    status: "planned" as const,
    statusText: "计划中",
    icon: Play,
    features: ["入门教程", "进阶开发", "部署指南", "实战案例"]
  },
  {
    title: "行业模板库",
    description: "针对不同行业和应用场景，提供开箱即用的项目模板。每个模板都包含完整的业务逻辑、UI 设计和最佳实践，让你快速启动项目。作为基础版本的扩展包，需要单独购买，但基础版本用户享受大力度优惠。",
    timeline: "2026 Q3",
    status: "planned" as const,
    statusText: "计划中",
    icon: FileText,
    features: ["SaaS 应用模板", "软件售卖模板", "AI 项目模板", "电商平台模板", "企业官网模板", "基础版用户专享优惠"]
  }
];

const useCases = [
  {
    title: "SaaS 应用开发",
    description: "用户认证、订阅管理、支付集成等核心功能，快速构建 SaaS 产品。",
    icon: CreditCard,
    gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
    href: "/solutions/saas"
  },
  {
    title: "出海项目",
    description: "多语言支持、国际化支付、全球部署，助力产品出海。",
    icon: Globe,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
    href: "/solutions/global"
  },
  {
    title: "AI 驱动开发",
    description: "集成 Vercel AI SDK，支持多 AI 提供商，智能化开发。",
    icon: Brain,
    gradient: "bg-gradient-to-br from-orange-500 to-red-500",
    href: "/features/ai"
  }
];

const testimonials = [
  {
    quote: "早鸟价太值了！完整的源码和终身更新，帮我快速搭建了自己的 SaaS 项目，一个月就回本了。",
    author: "张伟",
    role: "独立开发者"
  },
  {
    quote: "技术支持很给力，遇到问题都能快速解决。双框架支持让团队可以选择熟悉的技术栈。",
    author: "李小明",
    role: "创业公司 CTO"
  },
  {
    quote: "出海功能特别实用，国际化和支付都配置好了，省了我们大量的开发时间。",
    author: "王芳",
    role: "产品经理"
  }
];


const applicationFeatures = [
  {
    title: "国内外双体系支持",
    subtitle: "一套代码，双市场覆盖",
    description: "完美适配国内外不同市场需求。国内支持微信登录、手机号登录、微信支付等本土化功能；国外支持主流 OAuth 登录（Google、GitHub、Apple）、Stripe 和 Lemon Squeezy 支付体系。一套代码，双市场覆盖。",
    highlights: [
      "微信登录 & 手机号登录",
      "OAuth 登录（Google、GitHub、Apple）",
      "微信支付 & Stripe & Lemon Squeezy",
      "国内外无缝切换"
    ],
    imageTitle: "双体系架构",
    icon: Globe
  },
  {
    title: "内置 Admin Panel",
    subtitle: "企业级管理后台，开箱即用",
    description: "开箱即用的管理后台，提供完整的用户管理、订阅管理、数据分析等功能。基于现代化 UI 组件库构建，支持角色权限控制、实时数据监控、批量操作等企业级功能。让你专注于业务逻辑，而非重复的管理界面开发。",
    highlights: [
      "用户管理 & 订阅管理",
      "数据分析 & 实时监控",
      "角色权限控制",
      "批量操作功能"
    ],
    imageTitle: "管理后台",
    icon: BarChart3
  },
  {
    title: "AI Ready 集成",
    subtitle: "基于 Vercel AI SDK，即插即用",
    description: "基于 Vercel AI SDK 构建的完整 AI 解决方案。内置简易的 AI Chat 页面，支持多种 AI 模型切换（OpenAI、Claude、Gemini 等）。提供流式响应、对话历史、使用量统计等功能，让你的应用瞬间具备 AI 能力。",
    highlights: [
      "Vercel AI SDK 集成",
      "多模型支持（OpenAI、Claude、Gemini）",
      "流式响应 & 对话历史",
      "使用量统计 & AI Chat 页面"
    ],
    imageTitle: "AI 集成",
    icon: Brain
  }
];
