
import { NextResponse } from 'next/server';
import { studentService } from '@/services/student.service';

/**
 * GET /api/students/[id]
 * Fetch student profile details
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Simulate Auth Check (Middleware handles this usually)
    // const session = await auth(); 
    // if (!session) return unauthorized();

    const student = await studentService.getStudentById(id);

    if (!student) {
      return NextResponse.json(
        { status: 'error', message: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: student
    });

  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
