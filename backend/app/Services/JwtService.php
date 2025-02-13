<?php

namespace App\Services;

use Lcobucci\JWT\Token\Builder;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Encoding\ChainedFormatter;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Token\Parser as JwtParser;
use Lcobucci\JWT\Validation\Validator as JWTValidator;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use DateTimeImmutable;

class JwtService
{
    protected $jwtParser;
    protected $signingKey;

    public function __construct()
    {
        $this->jwtParser = new JwtParser(new JoseEncoder());
        $this->signingKey = InMemory::plainText(config('app.jwt_secret'));
    }

    public function generateToken($user, $expiresIn)
    {
        $expiresIn = (int) $expiresIn;
        if ($expiresIn <= 0) {
            $expiresIn = 3600;
        }

        $now = new DateTimeImmutable();
        $algorithm = new Sha256();

        return (new Builder(new JoseEncoder(), ChainedFormatter::default()))
            ->issuedAt($now)
            ->expiresAt($now->modify("+{$expiresIn} seconds"))
            ->withClaim('uid', $user->UserID)
            ->withClaim('email', $user->Email)
            ->withClaim('user_type', $user->UserType)
            ->getToken($algorithm, $this->signingKey)
            ->toString();
    }

    public function validateToken($tokenString)
    {
        if (!$tokenString || !str_starts_with($tokenString, 'Bearer ')) {
            return false;
        }

        try {
            $token = $this->jwtParser->parse(str_replace('Bearer ', '', $tokenString));
            $validator = new JWTValidator();

            return $validator->validate($token, new SignedWith(new Sha256(), $this->signingKey));
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getPayload($tokenString)
    {
        if (!$tokenString || !str_starts_with($tokenString, 'Bearer ')) {
            return null;
        }

        try {
            $token = $this->jwtParser->parse(str_replace('Bearer ', '', $tokenString));
            return $token->claims();
        } catch (\Exception $e) {
            return null;
        }
    }
}
