<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingCancelled;

class BookingController extends Controller
{
    public function index()
    {
        return Booking::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'room' => 'required|string|max:255',
        ]);

        $conflict = Booking::where('room', $request->room)
            ->where('status', 'Approved')
            ->where('check_in', '<=', $request->check_out)
            ->where('check_out', '>=', $request->check_in)
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'This room is already booked for the selected dates.',
            ], 422);
        }

        $booking = Booking::create([
            'name' => $request->name,
            'email' => $request->email,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'room' => $request->room,
            'status' => 'Pending',
        ]);

        return response()->json($booking, 201);
    }

    public function show($id)
    {
        $booking = Booking::findOrFail($id);
        return response()->json($booking);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:Pending,Approved,Cancelled',
        ]);

        $booking->status = $request->status;
        $booking->save();

        if ($request->status === 'Cancelled') {
            Mail::to($booking->email)->send(new BookingCancelled($booking));
        }

        return response()->json($booking);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(null, 204);
    }
}
