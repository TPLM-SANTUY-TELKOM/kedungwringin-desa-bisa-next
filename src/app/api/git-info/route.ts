import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Get last commit date from git
    const { stdout } = await execAsync('git log -1 --format=%ci');
    const commitDate = stdout.trim();
    
    // Format date to Indonesian format
    if (commitDate) {
      const date = new Date(commitDate);
      const formattedDate = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      
      return NextResponse.json({
        lastUpdate: formattedDate,
        commitDate: commitDate,
      });
    }
    
    return NextResponse.json({
      lastUpdate: null,
      commitDate: null,
    });
  } catch (error) {
    // If git command fails (e.g., not a git repo or git not available)
    console.error('Error getting git info:', error);
    return NextResponse.json({
      lastUpdate: null,
      commitDate: null,
      error: 'Git info tidak tersedia',
    });
  }
}

