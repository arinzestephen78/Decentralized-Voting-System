;; Ballot Contract

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_BALLOT_CLOSED (err u101))
(define-constant ERR_INVALID_OPTION (err u102))

;; Data Variables
(define-data-var ballot-open bool true)
(define-data-var ballot-options (list 10 (string-ascii 50)) (list))

;; Data Maps
(define-map votes principal uint)

;; Public Functions
(define-public (create-ballot (options (list 10 (string-ascii 50))))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (var-set ballot-options options)
    (var-set ballot-open true)
    (ok true)))

(define-public (close-ballot)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (var-set ballot-open false)
    (ok true)))

(define-public (cast-vote (option uint))
  (let ((voter tx-sender))
    (asserts! (var-get ballot-open) ERR_BALLOT_CLOSED)
    (asserts! (< option (len (var-get ballot-options))) ERR_INVALID_OPTION)
    (ok (map-set votes voter option))))

;; Read-only Functions
(define-read-only (get-ballot-options)
  (var-get ballot-options))

(define-read-only (is-ballot-open)
  (var-get ballot-open))

(define-read-only (get-vote (voter principal))
  (map-get? votes voter))

