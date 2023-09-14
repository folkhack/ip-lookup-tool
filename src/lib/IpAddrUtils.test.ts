import { IpAddrUtils } from './IpAddrUtils';

const ipv4_valid = [
    '192.168.1.1',
    '10.0.0.1',
    '172.16.0.1',
    '255.255.255.255',
    '0.0.0.0',
    '8.8.8.8',
    '8.8.4.4',
    '127.0.0.1',
    '192.0.2.146',
    '203.0.113.195',
    '198.51.100.14',
    '224.0.0.0',
    '240.0.0.0',
    '248.11.22.33',
    '192.0.2.0',
    '198.51.100.0',
    '203.0.113.0',
    '192.168.0.255',
    '10.255.255.255',
    '172.31.255.255',
    '192.168.0.0',
    '10.0.0.0',
    '172.16.0.0',
    '192.168.0.100',
    '10.0.0.100',
    '172.16.0.100',
    '192.168.0.200',
    '10.0.0.200',
    '172.16.0.200',
    '192.168.0.254',
    '10.0.0.254',
    '172.16.0.254',
    '192.0.2.255',
    '198.51.100.255',
    '203.0.113.255',
    '192.0.2.1',
    '198.51.100.1',
    '203.0.113.1',
    '192.0.2.2',
    '198.51.100.2',
    '203.0.113.2',
    '192.0.2.3',
    '198.51.100.3',
    '192.168.001.001',
    '010.010.010.010',
];

const ipv4_invalid = [
    '192.168.256.256',
    '256.256.256.256',
    '192.168.1.',
    '192.168..1',
    '192.168.1',
    '192.168.1.1.1',
    '192.168.1.-1',
    '192.168.1.1a',
    '192.168.1.1/24',
    '192.168.1.256',
    '192.168.1.999',
    '192.168.1.1:80',
    '192.168.1.1#80',
    '192.168.1.1!',
    '192.168.1.1@',
    '192.168.1.1$',
    '192.168.1.1%',
    '192.168.1.1^',
    '192.168.1.1&',
    '192.168.1.1*',
    '192.168.1.1(',
];

const ipv6_valid = [
    '::1',
    '::',
    '2001:db8::ff00:42:8329',
    '2001:db8::',
    '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    '2001:db8:85a3:0:0:8a2e:370:7334',
    '2001:db8:85a3::8a2e:370:7334',
    '0:0:0:0:0:0:0:1',
    '0:0:0:0:0:0:0:0',
    '::ffff:c0a8:101',
    '2001:db8:a0b:12f0::1',
    '2001:0db8:0:0:0:0:2:1',
    '2001:db8::2:1',
    '2001:db8:0:0:1::1',
    '2001:db8:0:42::',
    '2001:db8:0:42:0:0:0:7',
    '2001:db8:0:42::7',
    '2001:db8:0:42:3:4:5:6',
    '2001:db8:0:42:3::6',
    '2001:db8:a::123',
    '2001:db8:a:b:c:d::2',
    '2001:db8::1:0:0:0:2',
];

const ipv6_invalid = [
    ':::1',
    '2001:db8:::42',
    '2001:db8::g42',
    '2001:db8::42::1',
    '2001:db8::42:',
    '2001:db8::42:1:',
    '2001:db8::42:1::',
    '2001:db8::42:1:2:3:4:5:6:7',
    '2001:db8::42::1:2',
    '2001:db8::42:1:2:3:4:5:',
];

describe( 'IpAddrUtils', () => {

    const IpAddrUtilsLocal = new IpAddrUtils;

    // Empty
    test( 'Empty string is invalid', () => {

        const result = IpAddrUtilsLocal.validate_ip_addr( '' );
        expect( result.success ).toBe( false );
        expect( result.errors.length ).toBe( 2 );
    } );

    // IPv4
    for( const ip of ipv4_valid ) {

        test( 'IPv4 "' + ip + '" is valid', () => {

            const result = IpAddrUtilsLocal.validate_ip_addr( ip );
            expect( result.success ).toBe( true );
            expect( result.errors.length ).toBe( 0 );
        } );
    }

    for( const ip of ipv4_invalid ) {

        test( 'IPv4 "' + ip + '" is invalid', () => {

            const result = IpAddrUtilsLocal.validate_ip_addr( ip );
            expect( result.success ).toBe( false );
            expect( result.errors.length ).toBe( 1 );
        } );
    }

    // IPv6
    for( const ip of ipv6_valid ) {

        test( 'IPv6 "' + ip + '" is valid', () => {

            const result = IpAddrUtilsLocal.validate_ip_addr( ip );
            expect( result.success ).toBe( true );
            expect( result.errors.length ).toBe( 0 );
        } );
    }

    for( const ip of ipv6_invalid ) {

        test( 'IPv6 "' + ip + '" is invalid', () => {

            const result = IpAddrUtilsLocal.validate_ip_addr( ip );
            expect( result.success ).toBe( false );
            expect( result.errors.length ).toBe( 1 );
        } );
    }
} );
