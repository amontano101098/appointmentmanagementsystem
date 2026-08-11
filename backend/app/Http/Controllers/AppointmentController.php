<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentBooked;
use App\Mail\AppointmentCancelled;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'date' => 'required',
            'time' => 'required',
        ]);

        $appointment = Appointment::create([
            'name' => $request->name,
            'email' => $request->email,
            'date' => $request->date,
            'time' => $request->time,
            'status' => 'Pending'
        ]);

        // 📧 SEND EMAIL TO ADMIN
        Mail::to('yourgmail@gmail.com')
            ->send(new AppointmentBooked($appointment));

        return response()->json($appointment);
    }

    public function index()
    {
        return Appointment::all();
    }

    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->status = $request->status;
        $appointment->save();

        if ($request->status === 'Cancelled') {
            Mail::to($appointment->email)->send(new AppointmentCancelled($appointment));
        }

        return response()->json($appointment);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json(null, 204);
    }
}