<?php

use Illuminate\Support\Facades\Validator;
use LegacyApp\Site\Models\User;

if (!authenticateFromCookie($username, $permissions, $userDetails)) {
    abort(401);
}

$input = Validator::validate(request()->post(), [
    'preferences' => 'required|integer',
]);

/** @var User $user */
$user = request()->user();
$user->websitePrefs = $input['preferences'];
$user->save();

return response()->json(['message' => __('legacy.success.ok')]);
