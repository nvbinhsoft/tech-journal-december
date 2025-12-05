import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogStore } from '@/lib/store';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogOut } from 'lucide-react';

export function SessionExpiredDialog() {
    const { sessionExpired, clearSessionExpired } = useBlogStore();
    const navigate = useNavigate();

    const handleConfirm = () => {
        clearSessionExpired();
        navigate('/login');
    };

    // Prevent interaction with page while dialog is open
    useEffect(() => {
        if (sessionExpired) {
            document.body.style.pointerEvents = 'none';
        } else {
            document.body.style.pointerEvents = '';
        }
        return () => {
            document.body.style.pointerEvents = '';
        };
    }, [sessionExpired]);

    return (
        <AlertDialog open={sessionExpired}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader className="text-center sm:text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <LogOut className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                    </div>
                    <AlertDialogTitle className="text-xl font-semibold">
                        Session Expired
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Your session has expired due to inactivity or the token has become invalid.
                        Please log in again to continue accessing the admin dashboard.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="min-w-[120px]"
                        style={{ pointerEvents: 'auto' }}
                    >
                        Log In Again
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
