
import { NextResponse } from "next/server";

// export  const Get=async(req:Request,res:Response)=>{
//     console.log("Get Request")
// }
export async function GET( res: NextResponse) {
    return NextResponse.json({
"msg":"it's a get request"
})
}
export async function POST(res: NextResponse) {
    return NextResponse.json({
        "msg": "it's a post request"
    });
}
export async function PUT(res: NextResponse) {
    return NextResponse.json({
        "msg": "it's a put request"
    });
}

export async function DELETE(res: NextResponse) {
    return NextResponse.json({
        "msg": "it's a delete request"
    });
}