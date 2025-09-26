import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function AvatarComp({image, imageFallback, className}) {
    return (
        <Avatar className={className}>
            <AvatarImage src= {image}/>
            <AvatarFallback>{imageFallback}</AvatarFallback>
        </Avatar>

    )
}

export default AvatarComp