import { useEffect, useRef, useState } from "react";

import {SWATCHES} from '../../../constants'
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "../../components/ui/button";
import axios from 'axios';

/*
O useRef é um hook do React que cria uma "referência" para armazenar um valor que não requer uma nova renderização do componente quando é atualizado.
Diferente de um useState, que causa uma re-renderização quando o estado muda, o valor de um useRef pode ser modificado sem que o componente seja re-renderizado.
*/

// interface para response do backend
interface Response {
    expr: string;
    result: string;
    assign: boolean
}

interface GeneratedResult {
    expression: string;
    answer: string;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    /*
    O valor inicial passado para o useRef é null. Isso significa que, no momento em que o componente é montado, a referência ainda não aponta para nenhum elemento. Posteriormente, ela será "conectada" ao <canvas> real que será renderizado no DOM.
    */
    const [isDrawing, setIsDrawing] = useState(false);

    const [color, setColor] = useState('rgb(255, 255, 255)')
    const [reset, setReset] = useState(false);
    const [result, setResult] = useState<GeneratedResult>()
    const [dictOfVars, setDictOfVars] = useState({})

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setReset(false);
        }
    }, [reset])
    // A array tem reset para ser rodado toda vez que o reset state mudar


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

    const sendData = async () => {
        const canvas = canvasRef.current
        if (canvas) {
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_URL}/calculate`,
                data: {
                    image: canvas.toDataURL('image/png'),
                    dict_of_vars: dictOfVars,
                }
            })
            const resp = await response.data;
            console.log('Response: ', resp)
        }
    }

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas. getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }

        }
    }

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
                ctx.strokeStyle = color
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                ctx.stroke()
            }
        }
    }

    return (
    <>
        <div className="grid grid-cols-3 gap-2">
            <Button
                onClick={() => setReset(true)}
                className="z-20 bg-black text-white"
                variant='default'
                color="black"
            >
                Reset
            </Button>
            <Group className="z-20">
                    {SWATCHES.map((swatchColor: string) => (
                        <ColorSwatch
                            key={swatchColor}
                            color={swatchColor}
                            onClick={() => setColor(swatchColor)}
                            />
                    ))}
            </Group>
            <Button
                onClick={sendData}
                className="z-20 bg-black text-white"
                variant='default'
                color="black"
            >
                Calcular
            </Button>

        </div>
        <canvas 
            ref={canvasRef}
            id='canvas'
            className="absolute top-0 left-0 w-full h-full"
            onMouseDown={startDrawing}
            onMouseOut={stopDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            />
    </>
    )
}