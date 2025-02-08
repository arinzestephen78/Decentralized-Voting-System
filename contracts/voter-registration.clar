;; Voter Registration Contract

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_ALREADY_REGISTERED (err u101))
(define-constant ERR_NOT_ELIGIBLE (err u102))

;; Data Maps
(define-map voters principal bool)
(define-map eligible-voters principal bool)

;; Public Functions
(define-public (register-voter)
  (let ((caller tx-sender))
    (asserts! (is-eligible caller) ERR_NOT_ELIGIBLE)
    (asserts! (not (is-registered caller)) ERR_ALREADY_REGISTERED)
    (ok (map-set voters caller true))))

(define-public (add-eligible-voter (voter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set eligible-voters voter true))))

(define-public (remove-eligible-voter (voter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-delete eligible-voters voter))))

;; Read-only Functions
(define-read-only (is-registered (voter principal))
  (default-to false (map-get? voters voter)))

(define-read-only (is-eligible (voter principal))
  (default-to false (map-get? eligible-voters voter)))

