import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Ban, Star, Clock, MessageSquare } from 'lucide-react';

interface ModerationCase {
  id: string;
  reportedUserId: string;
  reporterId: string;
  strangerTag: string;
  timestamp: number;
  reason: string;
  status: 'pending' | 'resolved';
}

export default function ModerationDashboard() {
  const [cases, setCases] = useState<ModerationCase[]>([
    {
      id: 'CASE-9921',
      reportedUserId: 'user_anon_44',
      reporterId: 'user_anon_12',
      strangerTag: '#9X2P',
      timestamp: Date.now() - 60000,
      reason: 'inappropriate_media',
      status: 'pending'
    },
    {
      id: 'CASE-9920',
      reportedUserId: 'user_anon_88',
      reporterId: 'user_anon_55',
      strangerTag: '#1B4K',
      timestamp: Date.now() - 300000,
      reason: 'harassment',
      status: 'pending'
    }
  ]);

  const [selectedCase, setSelectedCase] = useState<ModerationCase | null>(null);

  const handleResolve = (id: string, ban: boolean) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
    if (ban) {
      alert(`🚫 Пользователь забанен навсегда. Нарушителю списано 50 Stars.`);
    } else {
      alert(`✅ Жалоба отклонена. Модератор получил +5 Stars за проверку.`);
    }
    setSelectedCase(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Guardian Dashboard</h1>
              <p className="text-sm text-gray-400">Панель модерации Room of Secrets</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="font-mono font-bold text-amber-400">1,240 Stars</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cases List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Очередь жалоб ({cases.filter(c => c.status === 'pending').length})
            </h2>
            
            <div className="space-y-3">
              {cases.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    c.status === 'pending' 
                      ? 'bg-[#1C1C1F] border-amber-500/30 hover:border-amber-500/60' 
                      : 'bg-[#1C1C1F] border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-400">{c.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      c.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {c.status === 'pending' ? 'New' : 'Done'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">Нарушитель: {c.strangerTag}</div>
                  <div className="text-xs text-gray-400 mt-1">Причина: {c.reason === 'inappropriate_media' ? '📸 NSFW контент' : '💬 Харассмент'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Panel */}
          <div className="lg:col-span-2">
            {selectedCase ? (
              <div className="bg-[#1C1C1F] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-purple-900/10">
                  <h3 className="text-xl font-bold text-white">Дело {selectedCase.id}</h3>
                  <p className="text-sm text-gray-400">Проверка жалобы от пользователя</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Chat Preview Mockup */}
                  <div className="bg-[#0A0A0B] p-4 rounded-xl space-y-3">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-2">Лог переписки</div>
                    <div className="flex justify-end">
                      <div className="bg-purple-600 text-white text-xs p-2 rounded-xl max-w-[80%]">Привет, как дела?</div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#1C1C1F] text-gray-300 text-xs p-2 rounded-xl max-w-[80%] border border-white/5">
                        Привет! Смотри что я нашел... [ФОТО СКРЫТО]
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-red-600 text-white text-xs p-2 rounded-xl max-w-[80%]">🔥 SOS ACTIVATED</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleResolve(selectedCase.id, false)}
                      className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-bold flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" /> Отклонить
                    </button>
                    <button 
                      onClick={() => handleResolve(selectedCase.id, true)}
                      className="py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                    >
                      <Ban className="w-5 h-5" /> Забанить (-50 Stars)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-[#1C1C1F]/50 rounded-2xl border border-white/5">
                <Eye className="w-16 h-16 mb-4 opacity-20" />
                <p>Выберите дело для проверки</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
