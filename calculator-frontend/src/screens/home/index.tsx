import { useEffect, useRef, useState } from "react";

/*
O useRef é um hook do React que cria uma "referência" para armazenar um valor que não requer uma nova renderização do componente quando é atualizado.
Diferente de um useState, que causa uma re-renderização quando o estado muda, o valor de um useRef pode ser modificado sem que o componente seja re-renderizado.
*/

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    /*
    O valor inicial passado para o useRef é null. Isso significa que, no momento em que o componente é montado, a referência ainda não aponta para nenhum elemento. Posteriormente, ela será "conectada" ao <canvas> real que será renderizado no DOM.
    */
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                /*
                O objetivo é ajustar a altura do canvas para que ele ocupe todo o espaço vertical disponível abaixo do topo onde ele está posicionado. Se o canvas não estiver na parte superior da página, é necessário descontar a distância dele em relação ao topo (por isso o canvas.offsetTop)
                */
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
            }
        }
    }, []);
    // a array vazia faz com que este efeito só rode depois da primeira renderização

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            // canvasRef.current.getContext('2d') deixa você desenhar no canvas
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
            
        }
    }

    const stopDrawing = () => {
        setIsDrawing(false);
    }

    // Função para implementar o método de desenho
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = 'white'
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                ctx.stroke()
            }
        }
    }

    return (
        <canvas 
            ref={canvasRef}
            id='canvas'
            className="absolute top-0 left-0 w-full h-full"
            onMouseDown={startDrawing}
            onMouseOut={stopDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
        />
    )
}