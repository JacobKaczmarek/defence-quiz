import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';


export const POST = async (req: Request) => {
    const file = await req.blob();

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const { data, error } = await supabase.storage
        .from('savage-academy')
        .upload(uuid(), file, { contentType: file.type });
    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('bando-academy').getPublicUrl(data.path);
    if (!urlData) {
        return NextResponse.json(
            { message: 'Something went wrong while retrieving url of the image.' },
            { status: 500 }
        );
    }

    return NextResponse.json({ url: urlData.publicUrl }, { status: 200 });
};
