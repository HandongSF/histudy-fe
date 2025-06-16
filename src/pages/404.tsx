import { Button } from "@/components/ui/button";
import animationData from "@/noData.json";
import Lottie from "lottie-react";
import { AlertTriangle, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        {/* <img
          src="/placeholder.svg?height=250&width=250"
          alt="땀 흘리는 귀여운 우주인"
          className="w-48 h-48 sm:w-64 sm:h-64 animate-bounce-slow"
        />
         */}
        <Lottie animationData={animationData} style={{ width: "250px" }} />
        {/* 땀방울 효과 */}
        <div className="absolute top-1/4 left-1/4 w-3 h-5 bg-sky-400 rounded-full opacity-80 animate-sweat-drop-1"></div>
        <div className="absolute top-1/3 right-1/4 w-2.5 h-4 bg-sky-400 rounded-full opacity-70 animate-sweat-drop-2 animation-delay-300"></div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(-3%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }

        @keyframes sweat-drop-1 {
          0% {
            transform: translateY(-20px) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateY(10px) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(30px) scale(0.5);
            opacity: 0;
          }
        }
        .animate-sweat-drop-1 {
          animation: sweat-drop-1 2s infinite ease-out;
          animation-delay: 0.2s;
        }

        @keyframes sweat-drop-2 {
          0% {
            transform: translateY(-15px) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateY(8px) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translateY(25px) scale(0.5);
            opacity: 0;
          }
        }
        .animate-sweat-drop-2 {
          animation: sweat-drop-2 2s infinite ease-out;
          animation-delay: 0.5s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s; /* Ensure this class is defined or used if needed */
        }
      `}</style>

      <h1 className="text-5xl sm:text-6xl font-bold text-sky-500 mb-4 flex items-center gap-3">
        <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />
        404
      </h1>
      <p className="text-xl sm:text-2xl font-semibold text-slate-700 mb-3">
        앗! 우주 미아가 되었어요!
      </p>
      <p className="text-slate-600 mb-8 max-w-md">
        요청하신 페이지를 찾을 수 없습니다.
        <br />
        홈으로 돌아가 안전하게 다시 시작하세요!
      </p>

      <Link to="/">
        <Button
          size="lg"
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold"
        >
          <Home className="mr-2 h-5 w-5" />
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
}
