{/* CHAT TAB - FULL HEIGHT LAYOUT */}
{activeTab === 'chat' && (
  <div className="flex flex-col h-full">
    
    {/* Chat Session Header - Fixed Top */}
    <div className="bg-[#101012] px-3.5 py-2.5 border-b border-white/[0.05] flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-2.5">
        <div className="relative">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${identityRequestState === 'accepted' ? selectedStranger.avatarColor : 'from-purple-800 to-indigo-950'} flex items-center justify-center overflow-hidden border border-white/[0.1]`}>
            {identityRequestState === 'accepted' ? (
              <span className="text-xs font-bold text-white">{selectedStranger.name[0]}</span>
            ) : (
              <div className="w-full h-full bg-white/[0.03] backdrop-blur-md flex items-center justify-center">
                <span className="text-xs text-purple-300 font-mono font-bold">?</span>
              </div>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#101012]" />
        </div>

        <div>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-extrabold text-white">
              {identityRequestState === 'accepted' ? selectedStranger.name : `Незнакомец ${selectedStranger.tag}`}
            </span>
            <span className="text-[9px] text-purple-400 font-semibold font-mono bg-purple-500/10 px-1 py-0.2 rounded">
              ⭐ {selectedStranger.karma}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[9px] text-gray-400">
            <Clock className="w-2.5 h-2.5 text-purple-400" />
            <span>Осталось {formatTime(chatTimer)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={handleRevealIdentity}
          disabled={identityRequestState === 'accepted'}
          className={`p-1.5 rounded-lg border transition flex items-center space-x-1 ${
            identityRequestState === 'accepted'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : identityRequestState === 'sent'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                : 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20'
          }`}
          title="Раскрыть личность за 50 звёзд"
        >
          <User className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">
            {identityRequestState === 'accepted' ? 'Раскрыт' : identityRequestState === 'sent' ? 'Ждем' : '50 ⭐'}
          </span>
        </button>

        <button
          onClick={handleBurnBridge}
          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all flex items-center justify-center"
          title="Сжечь мост (удалить историю)"
        >
          <Flame className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleExitChat(false)}
          className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white transition-all"
          title="Выйти"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    {/* MESSAGES AREA - Flex grow to fill space */}
    <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-noise bg-[#08080a] custom-chat-scroll">
      {chatMessages.map((msg) => {
        if (msg.sender === 'system') {
          return (
            <div key={msg.id} className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-2xl text-center text-[10px] text-gray-400 leading-snug space-y-1 mx-2">
              <Info className="w-4 h-4 text-purple-400 mx-auto" />
              <p>{msg.text}</p>
            </div>
          );
        }

        const isUser = msg.sender === 'user';
        return (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[80%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <span className="text-[9px] text-gray-500 mb-0.5 px-1">
              {isUser ? 'Вы' : (identityRequestState === 'accepted' ? selectedStranger.name : `Незнакомец ${selectedStranger.tag}`)}
            </span>

            <div
              className={`p-2.5 rounded-2xl text-xs relative overflow-hidden ${
                isUser
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-[#1C1C1F] text-gray-200 rounded-tl-none border border-white/[0.03]'
              }`}
            >
              {msg.type === 'media' ? (
                <div className="space-y-1.5">
                  <img 
                    src={msg.text} 
                    alt="Media upload" 
                    className="rounded-lg max-h-36 object-cover w-full opacity-90"
                  />
                  <span className="text-[9px] text-white/50 block text-right">{msg.time}</span>
                </div>
              ) : msg.type === 'voice' ? (
                <div className="flex items-center space-x-2 py-1">
                  <Volume2 className="w-4 h-4 text-purple-300 animate-pulse" />
                  <span className="font-mono text-[10px] text-white font-medium">{msg.text}</span>
                  <span className="text-[8px] text-white/50">{msg.time}</span>
                </div>
              ) : (
                <>
                  <p className="leading-snug break-words">{msg.text}</p>
                  <span className={`text-[8px] mt-1 block text-right ${isUser ? 'text-white/60' : 'text-gray-500'}`}>
                    {msg.time}
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}

      {isStrangerTyping && (
        <div className="self-start flex flex-col items-start max-w-[80%]">
          <span className="text-[9px] text-gray-500 mb-0.5 px-1">Незнакомец {selectedStranger.tag}</span>
          <div className="bg-[#1C1C1F] p-2.5 rounded-2xl rounded-tl-none text-xs text-gray-400 flex items-center space-x-1.5 border border-white/[0.03]">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      )}

      <div ref={chatBottomRef} />
    </div>

    {/* PREMIUM CONTROLS - Fixed above input */}
    <div className="bg-[#101012]/80 border-t border-white/[0.04] p-2 flex items-center justify-between space-x-1.5 shrink-0">
      <button
        onClick={handleUnlockMedia}
        className={`px-2 py-1 rounded-lg text-[10px] flex items-center space-x-1 border transition-all ${
          mediaUnblocked || isRoomPlus
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-[#1C1C1F] border-white/[0.05] text-[#00E5FF] hover:border-cyan-400/30'
        }`}
      >
        {mediaUnblocked || isRoomPlus ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Медиа: ОК</span>
            {mediaTimer !== null && (
              <span className="text-[9px] font-mono font-medium">({formatTime(mediaTimer)})</span>
            )}
          </>
        ) : (
          <>
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Медиа за 10 ⭐</span>
          </>
        )}
      </button>

      <div className="flex items-center space-x-1">
        <button
          onClick={handleExtendLimit}
          className="px-2 py-1 rounded-lg bg-[#1C1C1F] border border-white/[0.05] text-amber-300 hover:border-amber-300/30 text-[10px] flex items-center space-x-1 transition-all"
          title="Добавить 15 минут за 15 Stars"
        >
          <Clock className="w-3 h-3 text-amber-400" />
          <span>⏰ +15м (15 ⭐)</span>
        </button>
      </div>
    </div>

    {/* INPUT BAR - Fixed Bottom */}
    <form onSubmit={handleSendMessage} className="bg-[#0A0A0B] p-2.5 border-t border-white/[0.05] flex items-center space-x-2 shrink-0">
      <button
        type="button"
        onClick={handleSendPhotoMock}
        className={`p-2 rounded-xl transition ${
          mediaUnblocked || isRoomPlus
            ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
            : 'bg-[#1C1C1F] text-gray-500 hover:text-gray-300'
        }`}
        title={mediaUnblocked || isRoomPlus ? "Отправить случайное фото" : "Купите разблокировку медиа за 10 Stars"}
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={handleSendVoiceMock}
        className={`p-2 rounded-xl transition ${
          mediaUnblocked || isRoomPlus
            ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
            : 'bg-[#1C1C1F] text-gray-500 hover:text-gray-300'
        }`}
        title={mediaUnblocked || isRoomPlus ? "Записать голосовое сообщение" : "Купите разблокировку медиа за 10 Stars"}
      >
        <Volume2 className="w-4 h-4" />
      </button>

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder={isStrangerTyping ? 'Печатает ответ...' : 'Напишите сообщение...'}
        className="flex-1 bg-[#1C1C1F] border border-white/[0.05] text-xs text-white rounded-xl py-2 px-3 placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
      />

      <button
        type="submit"
        className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 active:scale-95 transition flex items-center justify-center shadow-glow-purple"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  </div>
)}
