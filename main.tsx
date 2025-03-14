'use client';
import React, { Context, createContext, ReactNode, useContext, useState } from "react";

export interface IModalProps{
    title?: string;
    message: string;
    options: Array<any>;
    setResult: React.Dispatch<React.SetStateAction<any>>;
    Render: (parameter:  {config: ModalObject})=> React.ReactNode;
}
 
export type AddModalFC = ({title, message, options, setResult, Render}: IModalProps)=> void;
export const ModalContext: React.Context<{ add: AddModalFC; } | undefined> = createContext< {add: AddModalFC} | undefined >(undefined);

export function ModalReactJS({children}: {children: React.ReactNode}): React.ReactNode{
    const [modalElements, setModalElements] = useState<Array<{render: (parameter: {config: ModalObject})=> React.ReactNode, config: ModalObject}>>([]);
   
    const addModal: AddModalFC = ({title, message, options, setResult, Render}: IModalProps) => {
        const element = {render: Render, config: new ModalObject(message, options, setResult, setModalElements, title)};
        setModalElements([...modalElements, element])
    }

    return (
        <ModalContext.Provider value={{add: addModal}}>
            {children}
            <section>
                {modalElements.map((item, i)=> {
                    item.config.setIndex(i);
                    return (
                        <item.render key={"ModalElementNumber" + i}config={item.config}/>
                    );
                })}
            </section>
        </ModalContext.Provider>
    );
}

export function ExampleNode(): React.ReactNode{
    const modal = useContext(ModalContext)

    return (
        <article>
            This is a modal!
        </article>
    );
}

export interface IModalNodeProps{
    ModalUI: (parameter: {config: ModalObject;})=> React.ReactNode;
    config: ModalObject;
}
export function ModalNode({ModalUI, config}: IModalNodeProps): React.ReactNode{
    return <ModalUI config={config}/>
}

export class ModalObject{
    title?: string;
    index: number = -1;
    message: string;
    options: Array<any>;
    setter: React.Dispatch<React.SetStateAction<any>>;
    setModalElements: React.Dispatch<React.SetStateAction<Array<{render: (parameter: {config: ModalObject})=> React.ReactNode, config: ModalObject}>>>;

    constructor(
        message: string, 
        options: Array<any>, 
        setter: React.Dispatch<React.SetStateAction<any>>, 
        setModalElements: React.Dispatch<React.SetStateAction<Array<{render: (parameter: {config: ModalObject})=> React.ReactNode, config: ModalObject}>>>,
        title?: string
    ){
        this.title = title;
        this.message = message;
        this.options = options;
        this.setter = setter;
        this.setModalElements = setModalElements;
    }

    setIndex(i: number){
        this.index = i;
    }

    setValue(value: any){
        this.setter(value);
        this.close();
    }

    close(){
        this.setModalElements((prev)=> prev.filter((_, i)=> i !== this.index))
    }

}