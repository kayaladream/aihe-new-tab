'use client';

import { useState, useEffect, useRef } from 'react';
import { Lunar } from 'lunar-javascript';

export default function Home() {
  // --- 状态管理 ---
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [lunarDate, setLunarDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [links, setLinks] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [bgName, setBgName] = useState('cat');
  const [engines, setEngines] = useState([]);
  const [currentEngine, setCurrentEngine] = useState({ name: '百度', url: 'https://www.baidu.com/s?wd=' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startLoadVideo, setStartLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // --- 导航栏收纳 ---
  const [visibleLinks, setVisibleLinks] = useState([]); 
  const [hiddenLinks, setHiddenLinks] = useState([]);   
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false); 
  const moreMenuRef = useRef(null); 
  const searchContainerRef = useRef(null);

  useEffect(() => {
    setYear(new Date().getFullYear());

    // 1. 背景选择
    const envBg = process.env.NEXT_PUBLIC_BACKGROUND_LIST;
    let bgList = ['cat']; 
    if (envBg) {
      if (envBg === 'all') {
        bgList = ['cat'];
        for (let i = 1; i < 30; i++) bgList.push(`cat${i}`);
      } else {
        bgList = envBg.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    setBgName(bgList[Math.floor(Math.random() * bgList.length)]);

    // 2. 视频延迟
    const videoTimer = setTimeout(() => setStartLoadVideo(true), 800); 

    // 3. 核心算法：真正的“两行限制”逻辑
    const handleLayout = (allLinks) => {
      const width = window.innerWidth;
      // 左右留空：电脑端强制 10cm (单边约 380px)，手机端 20px
      const marginSide = width > 1024 ? 380 : 20;
      const availableWidth = width - (marginSide * 2);
      
      /**
       * 算法思路：
       * 我们不再猜 itemWidth，而是根据可用宽度计算一个“保守极限”。
       * 假设最小名字宽 80px，间距 16px，则一个链接约占 96px。
       * 如果可用宽度 1000px，则一行约 10 个。
       * 我们取两行总量的 90%，剩下的全部扔进 “...”。
       */
      const minEstimatedWidth = 115; // 提高预估宽度，包含长单词的情况
      const perRow = Math.floor(availableWidth / minEstimatedWidth);
      const limit = Math.max(2, (perRow * 2) - 1); 

      if (allLinks.length > limit) {
        setVisibleLinks(allLinks.slice(0, limit));
        setHiddenLinks(allLinks.slice(limit));
      } else {
        setVisibleLinks(allLinks);
        setHiddenLinks([]);
      }
    };

    const envLinks = process.env.NEXT_PUBLIC_NAV_LINKS;
    let parsedLinks = [{ name: '演示-淘宝', url: 'https://www.taobao.com' }];
    if (envLinks) {
      try { parsedLinks = JSON.parse(envLinks); } catch (e) { console.error(e); }
    }
    setLinks(parsedLinks);
    handleLayout(parsedLinks);

    const onResize = () => handleLayout(parsedLinks);
    window.addEventListener('resize', onResize);

    // 4. 搜索引擎 & 时间
    const envEngines = process.env.NEXT_PUBLIC_SEARCH_ENGINES;
    let defEngines = [
      { name: '百度', url: 'https://www.baidu.com/s?wd=' },
      { name: 'Google', url: 'https://www.google.com/search?q=' },
      { name: '必应', url: 'https://www.bing.com/search?q=' },
    ];
    if (envEngines) try { defEngines = JSON.parse(envEngines); } catch(e){}
    setEngines(defEngines);
    setCurrentEngine(defEngines[0]);

    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', weekday: 'long' }));
      const lunar = Lunar.fromDate(now);
      setLunarDate(`农历 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setIsMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(timer);
      clearTimeout(videoTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `${currentEngine.url}${encodeURIComponent(searchQuery)}`;
  };

  return (
    <main className="relative w-full h-screen overflow-hidden text-white font-sans">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>

      <img src={`/background/${bgName}.jpg`} className="absolute inset-0 w-full h-full object-cover z-0" alt="bg" />
      {startLoadVideo && (
        <video autoPlay loop muted playsInline key={bgName} onCanPlay={() => setIsVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}>
          <source src={`/background/${bgName}.mp4`} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />

      {/* GitHub */}
      <a href="https://github.com/kayaladream/cat-new-tab" target="_blank" className="absolute top-6 right-6 z-50 opacity-70 hover:opacity-100 transition-all hover:scale-110">
        <svg height="28" width="28" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
      </a>

      {/* Main */}
      <div className="relative z-20 flex flex-col items-center pt-44 h-full w-full px-4">
        <div className="flex items-end gap-3 mb-8 drop-shadow-md select-none">
          <h1 className="text-7xl font-light tracking-wide">{time}</h1>
          <div className="flex flex-col text-sm font-medium opacity-90 pb-2 gap-1">
            <span>{date}</span><span className="text-xs opacity-70">{lunarDate}</span>
          </div>
        </div>
        <form ref={searchContainerRef} onSubmit={handleSearch} className="w-full max-w-xl relative z-50 flex items-center bg-white/90 backdrop-blur rounded-full h-12 px-2 shadow-lg hover:bg-white transition-all">
          <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="pl-4 pr-3 flex items-center gap-1 border-r border-gray-300/50 h-3/5 text-gray-600 text-sm font-bold focus:outline-none">
            {currentEngine.name} <svg className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-14 left-0 w-36 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 z-50">
              {engines.map((e, i) => <div key={i} onClick={() => {setCurrentEngine(e); setIsDropdownOpen(false);}} className={`px-4 py-2 text-sm cursor-pointer rounded-lg hover:bg-black/5 ${currentEngine.name === e.name ? 'text-black font-extrabold' : 'text-gray-600 font-medium'}`}>{e.name}</div>)}
            </div>
          )}
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent outline-none text-gray-800 text-sm px-3" autoFocus />
          <button type="submit" className="h-9 w-9 bg-[#2c2c2c] rounded-full flex items-center justify-center hover:bg-black text-white"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
        </form>
      </div>

      {/* Nav - 终极稳定版 */}
      <div className="absolute bottom-[40px] w-full z-30 flex justify-center">
        {/* 背景阴影 */}
        <div className="absolute -bottom-10 inset-x-0 h-80 bg-gradient-to-t from-blue-300/20 to-transparent pointer-events-none" />
        
        {/* 核心容器：
            1. overflow-hidden & h-[100px]: 强制死守高度，溢出的第三行物理不可见。
            2. px-[380px]: 电脑端物理留白 10cm。
        */}
        <div className="relative flex flex-wrap justify-center content-start gap-x-4 gap-y-2 w-full px-5 lg:px-[380px] h-[100px] overflow-hidden">
          {visibleLinks.map((link, index) => (
            <a key={index} href={link.url} className="text-xs sm:text-sm font-extralight text-white/90 px-3 py-2 rounded-full hover:bg-white/20 hover:backdrop-blur-sm transition-all whitespace-nowrap h-fit">
              {link.name}
            </a>
          ))}

          {hiddenLinks.length > 0 && (
            <div className="relative h-fit" ref={moreMenuRef}>
              <button onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} className="text-sm font-bold text-white/90 w-10 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-all">•••</button>
              {isMoreMenuOpen && (
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-56 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 max-h-80 overflow-y-auto custom-scrollbar py-4" 
                     style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15px, black calc(100% - 15px), transparent)' }}>
                   {hiddenLinks.map((link, idx) => (
                     <a key={idx} href={link.url} className="block px-4 py-2 text-xs sm:text-sm text-center text-white/90 font-extralight rounded-full hover:bg-white/20 transition-all">
                       {link.name}
                     </a>
                   ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-2 w-full text-center z-40">
        <p className="text-[10px] sm:text-xs text-white/40 font-light select-none">Copyright © {year} KayalaDream All Rights Reserved</p>
      </div>
    </main>
  );
}
