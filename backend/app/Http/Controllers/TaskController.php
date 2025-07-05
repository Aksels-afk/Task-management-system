<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     * Get all tasks for the authenticated user
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        $tasks = $user->tasks()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $tasks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Not needed for API
     */
    public function create()
    {
        // Not needed for API
    }

    /**
     * Store a newly created resource in storage.
     * Create a new task
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'deadline' => 'required|date|after:now|before:+1 year',
            'status' => 'sometimes|in:pending,in_progress,completed',
        ]);

        // If validation fails, return error response
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create the task
        $task = Auth::user()->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'status' => $request->status ?? 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task
        ], 201);
    }

    /**
     * Display the specified resource.
     * Get a specific task
     */
    public function show(string $id)
    {
        $task = Auth::user()->tasks()->find($id);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $task
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     * Not needed for API
     */
    public function edit(string $id)
    {
        // Not needed for API
    }

    /**
     * Update the specified resource in storage.
     * Update a task
     */
    public function update(Request $request, string $id)
    {
        $task = Auth::user()->tasks()->find($id);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'deadline' => 'sometimes|required|date|after:now|before:+1 year',
            'status' => 'sometimes|in:pending,in_progress,completed',
        ]);

        // If validation fails, return error response
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update the task
        $task->update($request->only(['title', 'description', 'deadline', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * Delete a task
     */
    public function destroy(string $id)
    {
        $task = Auth::user()->tasks()->find($id);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully'
        ]);
    }
}
