<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Lcobucci\JWT\Token\Parser as JwtParser;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Validation\Validator;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use App\Models\UserAccount;
use DateTimeImmutable;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $tokenString = $request->header('Authorization');

        if (!$tokenString || !str_starts_with($tokenString, 'Bearer ')) {
            return response()->json(['error' => 'Unauthorized: Token missing'], 401);
        }

        try {
            $parser = new JwtParser(new JoseEncoder());
            $token = $parser->parse(str_replace('Bearer ', '', $tokenString));

            $signingKey = InMemory::plainText(env('JWT_SECRET'));
            $validator = new Validator();

            if (!$validator->validate($token, new SignedWith(new Sha256(), $signingKey))) {
                return response()->json(['error' => 'Unauthorized: Invalid token signature'], 403);
            }

            $expiration = $token->claims()->get('exp');
            if (is_numeric($expiration) && $expiration <= time()) {
                return response()->json(['error' => 'Unauthorized: Token has expired'], 401);
            }

            $tokenId = $token->claims()->get('jti');
            if ($tokenId && \Cache::has('invalidated_token_' . $tokenId)) {
                return response()->json(['error' => 'Unauthorized: Token is invalidated'], 401);
            }

            $userId = $token->claims()->get('uid');
            $user = UserAccount::find($userId);

            if (!$user) {
                return response()->json(['error' => 'Unauthorized: User not found'], 404);
            }

            $request->attributes->add(['user' => $user]);

            return $next($request);
        } catch (\Exception $e) {
            \Log::error('Token error: ' . $e->getMessage());
            return response()->json(['error' => 'Unauthorized: ' . $e->getMessage()], 401);
        }
    }
}
