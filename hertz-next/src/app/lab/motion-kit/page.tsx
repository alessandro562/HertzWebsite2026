import type { Metadata } from 'next'
import MotionKitLab from './MotionKitLab'

/**
 * /lab/motion-kit — documentazione vivente del Hertz Motion Kit. noindex.
 * Strumento di sviluppo (ogni primitive isolata con nome/uso/durata/easing/
 * desktop/mobile/reduced/cosa-non-fare), non una presentazione spettacolare.
 */
export const metadata: Metadata = {
  title: 'Motion Kit · lab',
  robots: { index: false, follow: false },
}

export default function MotionKitPage() {
  return <MotionKitLab />
}
