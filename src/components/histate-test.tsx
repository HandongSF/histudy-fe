import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHIState } from '@/hooks/HIState';
import { counterState } from '@/store/HISAtom';
import { useState, createContext, useContext, type ReactNode } from 'react';

// ===== Context API 구현 =====
interface CounterContextType {
   count: number;
   setCount: (value: number) => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

function CounterProvider({ children }: { children: ReactNode }) {
   const [count, setCount] = useState(0);
   console.log('[Render] CounterProvider (Context)');

   return <CounterContext.Provider value={{ count, setCount }}>{children}</CounterContext.Provider>;
}

function useCounter() {
   const context = useContext(CounterContext);
   if (!context) {
      throw new Error('useCounter must be used within CounterProvider');
   }
   return context;
}

// ===== Context API 컴포넌트들 =====
function ContextMultiCounter({ id }: { id: number }) {
   const { count, setCount } = useCounter();
   console.log(`[Render] ContextMultiCounter #${id}`);

   return (
      <div className="flex items-center gap-2 p-2 border rounded bg-orange-50">
         <Button size="sm" variant="outline" onClick={() => setCount(count - 1)}>
            -
         </Button>
         <span className="w-8 text-center font-mono">{count}</span>
         <Button size="sm" variant="outline" onClick={() => setCount(count + 1)}>
            +
         </Button>
         <span className="text-xs text-orange-600">Context #{id}</span>
      </div>
   );
}

function ContextNonStateComponent({ id }: { id: number }) {
   console.log(`[Render] ContextNonStateComponent #${id} - Context 사용 안함`);

   return (
      <div className="p-2 border rounded bg-gray-50">
         <span className="text-sm text-gray-600">Non-Context #{id}</span>
         <p className="text-xs text-gray-500">Context 사용 안함</p>
      </div>
   );
}

function ContextStateUsingComponent({ id }: { id: number }) {
   const { count } = useCounter();
   console.log(`[Render] ContextStateUsingComponent #${id} - Context 사용함`);

   return (
      <div className="p-2 border rounded bg-orange-50">
         <span className="text-sm text-orange-600">Context-Using #{id}</span>
         <p className="text-xs text-orange-500">값: {count}</p>
      </div>
   );
}

function ContextParentWithStateContent() {
   const { count, setCount } = useCounter();
   const [localCount, setLocalCount] = useState(0);

   return (
      <>
         <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-400">
            <p className="text-sm">
               Context: {count} | Local: {localCount}
            </p>
            <div className="flex gap-2 mt-2">
               <Button size="sm" onClick={() => setCount(count + 1)}>
                  Context +
               </Button>
               <Button size="sm" variant="outline" onClick={() => setLocalCount(localCount + 1)}>
                  Local +
               </Button>
            </div>
         </div>

         <div className="space-y-2 pl-4 border-l-2 border-gray-200">
            <p className="text-xs text-gray-500">자식 컴포넌트들:</p>
            <ContextChildWithState />
            <ContextChildWithoutState />
         </div>
      </>
   );
}

function ContextParentWithState() {
   console.log(`[Render] ContextParentWithState`);

   return (
      <Card>
         <CardHeader className="pb-3">
            <CardTitle className="text-sm">부모 컴포넌트 (Context 사용)</CardTitle>
         </CardHeader>
         <CardContent className="space-y-3">
            <ContextParentWithStateContent />
         </CardContent>
      </Card>
   );
}

function ContextChildWithState() {
   const { count } = useCounter();
   console.log(`[Render] ContextChildWithState - Context 변경시 렌더링됨`);

   return (
      <div className="p-2 bg-orange-50 rounded border-l-2 border-orange-300">
         <p className="text-sm text-orange-700">자식 (Context 사용)</p>
         <p className="text-xs text-orange-600">값: {count}</p>
      </div>
   );
}

function ContextChildWithoutState() {
   console.log(`[Render] ContextChildWithoutState - Context 변경시에도 렌더링됨!`);

   return (
      <div className="p-2 bg-red-50 rounded border-l-2 border-red-300">
         <p className="text-sm text-red-700">자식 (Context 사용 안함)</p>
         <p className="text-xs text-red-600">⚠️ 하지만 Provider 하위라 렌더링됨</p>
      </div>
   );
}

// ===== HIState 컴포넌트들 =====
function HIStateMultiCounter({ id }: { id: number }) {
   const [count, setCounter] = useHIState(counterState);

   return (
      <div className="flex items-center gap-2 p-2 border rounded bg-blue-50">
         <Button size="sm" variant="outline" onClick={() => setCounter((prev) => prev - 1)}>
            -
         </Button>
         <span className="w-8 text-center font-mono">{count}</span>
         <Button size="sm" variant="outline" onClick={() => setCounter(count + 1)}>
            +
         </Button>
         <span className="text-xs text-blue-600">HIState #{id}</span>
      </div>
   );
}

function HIStateNonStateComponent({ id }: { id: number }) {
   console.log(`[Render] HIStateNonStateComponent #${id} - HIState 사용 안함`);

   return (
      <div className="p-2 border rounded bg-gray-50">
         <span className="text-sm text-gray-600">Non-HIState #{id}</span>
         <p className="text-xs text-gray-500">HIState 사용 안함</p>
      </div>
   );
}

function HIStateStateUsingComponent({ id }: { id: number }) {
   const [count, setCounter] = useHIState<number>(counterState);
   console.log(`[Render] HIStateStateUsingComponent #${id} - HIState 사용함`);

   return (
      <div className="p-2 border rounded bg-blue-50">
         <div className="flex items-center justify-between">
            <div>
               <span className="text-sm text-blue-600">HIState-Using #{id}</span>
               <p className="text-xs text-blue-500">값: {count}</p>
            </div>
            <div className="flex gap-1">
               <Button size="sm" variant="outline" onClick={() => setCounter(count + 1)}>
                  +
               </Button>
               <Button size="sm" variant="outline" onClick={() => setCounter(count - 1)}>
                  -
               </Button>
            </div>
         </div>
      </div>
   );
}

function HIStateParentWithStateContent() {
   const [count, setCounter] = useHIState<number>(counterState);
   const [localCount, setLocalCount] = useState(0);

   return (
      <>
         <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <p className="text-sm">
               HIState: {count} | Local: {localCount}
            </p>
            <div className="flex gap-2 mt-2">
               <Button size="sm" onClick={() => setCounter(count + 1)}>
                  HIState +
               </Button>
               <Button size="sm" variant="outline" onClick={() => setLocalCount(localCount + 1)}>
                  Local +
               </Button>
            </div>
         </div>
         <div className="space-y-2 pl-4 border-l-2 border-gray-200">
            <p className="text-xs text-gray-500">자식 컴포넌트들:</p>
            <HIStateChildWithState />
            <HIStateChildWithoutState />
         </div>
      </>
   );
}
function HIStateParentWithState() {
   console.log(`[Render] HIStateParentWithState`);

   return (
      <Card>
         <CardHeader className="pb-3">
            <CardTitle className="text-sm">부모 컴포넌트 (HIState 사용)</CardTitle>
         </CardHeader>
         <CardContent className="space-y-3">
            <HIStateParentWithStateContent />
         </CardContent>
      </Card>
   );
}

function HIStateChildWithState() {
   const [count] = useHIState<number>(counterState);
   console.log(`[Render] HIStateChildWithState - HIState 변경시 렌더링됨`);

   return (
      <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-300">
         <p className="text-sm text-blue-700">자식 (HIState 사용)</p>
         <p className="text-xs text-blue-600">값: {count}</p>
      </div>
   );
}

function HIStateChildWithoutState() {
   console.log(`[Render] HIStateChildWithoutState - HIState 변경시 렌더링 안됨`);

   return (
      <div className="p-2 bg-green-50 rounded border-l-2 border-green-300">
         <p className="text-sm text-green-700">자식 (HIState 사용 안함)</p>
         <p className="text-xs text-green-600">✅ HIState 변경시 렌더링 안됨</p>
      </div>
   );
}

// ===== 메인 컴포넌트 =====
export default function HistateTest() {
   const [localTrigger, setLocalTrigger] = useState(0);
   console.log('[Render] HistateTest (Main)');

   return (
      <div className="container mx-auto p-4 space-y-4">
         {/* 헤더 */}
         <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">HIState vs Context API 렌더링 비교</h1>
            <p className="text-sm text-muted-foreground">콘솔을 열고 각각의 버튼을 클릭해서 렌더링 차이를 확인하세요</p>
            <div className="flex gap-2 justify-center">
               <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-200 rounded"></div>
                  <span className="text-xs">HIState</span>
               </div>
               <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-200 rounded"></div>
                  <span className="text-xs">Context API</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* HIState 섹션 */}
            <div className="space-y-4">
               <div className="text-center">
                  <h2 className="text-xl font-semibold text-blue-700">🔵 HIState</h2>
                  <p className="text-sm text-blue-600">선택적 렌더링</p>
               </div>

               {/* HIState 다중 카운터 */}
               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-sm">다중 카운터</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     <HIStateMultiCounter id={1} />
                     <HIStateMultiCounter id={2} />
                     <HIStateMultiCounter id={3} />
                  </CardContent>
               </Card>

               {/* HIState Sibling 테스트 */}
               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-sm">Sibling 렌더링 테스트</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     <HIStateStateUsingComponent id={1} />
                     <HIStateNonStateComponent id={1} />
                     <HIStateStateUsingComponent id={2} />
                     <HIStateNonStateComponent id={2} />
                  </CardContent>
               </Card>

               {/* HIState 부모-자식 */}
               <HIStateParentWithState />
            </div>

            {/* Context API 섹션 */}
            <CounterProvider>
               <div className="space-y-4">
                  <div className="text-center">
                     <h2 className="text-xl font-semibold text-orange-700">🟠 Context API</h2>
                     <p className="text-sm text-orange-600">Provider 하위 모든 컴포넌트 렌더링</p>
                  </div>

                  {/* Context 다중 카운터 */}
                  <Card>
                     <CardHeader className="pb-3">
                        <CardTitle className="text-sm">다중 카운터</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        <ContextMultiCounter id={1} />
                        <ContextMultiCounter id={2} />
                        <ContextMultiCounter id={3} />
                     </CardContent>
                  </Card>

                  {/* Context Sibling 테스트 */}
                  <Card>
                     <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Sibling 렌더링 테스트</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        <ContextStateUsingComponent id={1} />
                        <ContextNonStateComponent id={1} />
                        <ContextStateUsingComponent id={2} />
                        <ContextNonStateComponent id={2} />
                     </CardContent>
                  </Card>

                  {/* Context 부모-자식 */}
                  <ContextParentWithState />
               </div>
            </CounterProvider>
         </div>

         {/* 비교 가이드 */}
         <Card>
            <CardHeader className="pb-3">
               <CardTitle className="text-sm">🔍 렌더링 차이점</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                     <h4 className="font-semibold text-blue-700">HIState 특징:</h4>
                     <ul className="space-y-1 text-blue-600">
                        <li>• 해당 state를 사용하는 컴포넌트만 렌더링</li>
                        <li>• 사용하지 않는 컴포넌트는 렌더링 안됨</li>
                        <li>• 더 효율적인 렌더링</li>
                        <li>• 부모-자식 관계와 무관하게 선택적 렌더링</li>
                     </ul>
                  </div>
                  <div className="space-y-2">
                     <h4 className="font-semibold text-orange-700">Context API 특징:</h4>
                     <ul className="space-y-1 text-orange-600">
                        <li>• Provider 하위의 모든 컴포넌트 렌더링</li>
                        <li>• Context를 사용하지 않아도 렌더링됨</li>
                        <li>• 불필요한 렌더링 발생 가능</li>
                        <li>• React.memo로 최적화 필요</li>
                     </ul>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
